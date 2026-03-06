"""drop int_id from notes

Revision ID: 0977f571d7a2
Revises: f9a516ecc444
Create Date: ...
"""

from alembic import op
import sqlalchemy as sa

revision = "0977f571d7a2"
down_revision = "f9a516ecc444"
branch_labels = None
depends_on = None

def upgrade():
    op.drop_column("notes", "int_id")

def downgrade():
    op.add_column("notes", sa.Column("int_id", sa.Integer(), nullable=True))