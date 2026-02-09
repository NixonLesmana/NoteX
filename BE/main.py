from app import create_app

app = create_app()
#Test
if __name__ == "__main__":
    app.run(debug=True)