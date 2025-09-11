# database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Database URL
DATABASE_URL = "sqlite:///./app.db"

# 2. Create the SQLAlchemy engine
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3. Configure the session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Create the declarative base
Base = declarative_base()

# 5. Dependency to yield the database session for each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
def create_db_and_tables():
    Base.metadata.create_all(bind=engine)