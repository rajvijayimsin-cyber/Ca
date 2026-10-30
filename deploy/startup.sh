#!/bin/bash
# DO NOT use set -e — we want graceful degradation if any init step fails
# Each step uses || true to continue even on errors

echo "=== carenest — Startup ==="

cd /app/backend

# ── Step 1: Database migrations (alembic) ──────────────────────────
if [ -f alembic.ini ]; then
    echo "[1/4] Running alembic migrations..."
    python -m alembic upgrade head 2>&1 || echo "Warning: alembic migration failed (may already be up to date)"
else
    echo "[1/4] No alembic.ini found — skipping migrations"
fi

# ── Step 2: Create all tables (SQLAlchemy) ─────────────────────────
echo "[2/4] Initializing database tables..."
python -c "
import sys, os
sys.path.insert(0, '/app/backend')
os.environ.setdefault('DATABASE_URL', os.getenv('DATABASE_URL', 'sqlite:////app/backend/app.db'))

# Try multiple common patterns for database initialization
initialized = False

# Pattern A: init_db() function in database.py
try:
    from database import init_db
    init_db()
    print('  Tables created via init_db()')
    initialized = True
except Exception as e:
    pass

# Pattern B: Base.metadata.create_all(engine) directly
if not initialized:
    try:
        from database import engine, Base
        # Import all models so Base knows about them
        try:
            import models  # noqa: F401
        except Exception:
            pass
        Base.metadata.create_all(bind=engine)
        print('  Tables created via Base.metadata.create_all()')
        initialized = True
    except Exception as e:
        pass

# Pattern C: get all models from models.py, create tables
if not initialized:
    try:
        from sqlalchemy import create_engine
        from sqlalchemy.orm import declarative_base
        db_url = os.getenv('DATABASE_URL', 'sqlite:////app/backend/app.db')
        engine = create_engine(db_url)
        import models
        if hasattr(models, 'Base'):
            models.Base.metadata.create_all(bind=engine)
            print('  Tables created via models.Base')
            initialized = True
    except Exception as e:
        print(f'  Warning: could not create tables: {e}')

if not initialized:
    print('  Warning: database initialization skipped — app may still work if DB exists')
" 2>&1 || echo "Warning: database init step failed"

# ── Step 3: Seed admin user ────────────────────────────────────────
echo "[3/4] Seeding admin user..."
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@carenest.com}"
ADMIN_PASS="${ADMIN_PASSWORD:-Admin123!}"

python -c "
import sys, os
sys.path.insert(0, '/app/backend')
os.environ.setdefault('DATABASE_URL', os.getenv('DATABASE_URL', 'sqlite:////app/backend/app.db'))

admin_email = os.getenv('ADMIN_EMAIL', 'admin@carenest.com')
admin_pass  = os.getenv('ADMIN_PASSWORD', 'Admin123!')

# ── Hash the password — try every common pattern ────────────────
def hash_password(password):
    # Pattern A: AuthService class (auth.py or auth_service.py)
    for mod_name in ['auth', 'auth_service', 'security', 'utils.auth']:
        try:
            mod = __import__(mod_name, fromlist=['AuthService'])
            cls = getattr(mod, 'AuthService', None)
            if cls and hasattr(cls, 'get_password_hash'):
                return cls.get_password_hash(password)
            fn = getattr(mod, 'get_password_hash', None)
            if fn:
                return fn(password)
        except Exception:
            pass
    # Pattern B: passlib CryptContext
    try:
        from passlib.context import CryptContext
        ctx = CryptContext(schemes=['bcrypt'], deprecated='auto')
        return ctx.hash(password)
    except Exception:
        pass
    # Pattern C: bcrypt directly
    try:
        import bcrypt
        return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    except Exception:
        pass
    # Pattern D: werkzeug
    try:
        from werkzeug.security import generate_password_hash
        return generate_password_hash(password)
    except Exception:
        pass
    # Last resort — store plaintext (dev only, never production)
    print('  Warning: no password hashing library found — storing as-is (dev mode)')
    return password

hashed = hash_password(admin_pass)

# ── Create user — try every common DB access pattern ────────────
created = False

# Pattern A: SQLAlchemy session + User model
for db_mod in ['database']:
    try:
        db_module = __import__(db_mod)
        SessionLocal = getattr(db_module, 'SessionLocal', None)
        if not SessionLocal:
            continue
        import models
        User = getattr(models, 'User', None)
        if not User:
            continue
        db = SessionLocal()
        existing = db.query(User).filter(User.email == admin_email).first()
        if existing:
            print(f'  Admin already exists: {admin_email}')
            db.close()
            created = True
            break
        user_kwargs = dict(email=admin_email, hashed_password=hashed, full_name='Admin')
        # Optional fields — add if model supports them
        for field, val in [('is_verified', True), ('is_active', True), ('role', 'admin'),
                           ('subscription_plan', 'pro'), ('subscription_status', 'active')]:
            if hasattr(User, field):
                user_kwargs[field] = val
        user = User(**user_kwargs)
        db.add(user)
        db.commit()
        db.close()
        print(f'  Admin created: {admin_email}')
        created = True
        break
    except Exception as e:
        pass

if not created:
    print(f'  Warning: could not seed admin user ({admin_email}) — manual setup may be required')
" 2>&1 || echo "Warning: admin seed step failed"

# ── Step 4: Start services ─────────────────────────────────────────
cd /app
echo "[4/4] Starting nginx + backend via supervisord..."
exec supervisord -c /etc/supervisor/conf.d/app.conf
