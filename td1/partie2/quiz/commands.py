from .app import app,db

@app.cli.command()
def syncdb():
    """Initializes the database."""
    db.create_all()

@app.cli.command()
def inserts():
    pass