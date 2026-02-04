import os

structure = {
    "backend": {
        "src": {
            "config": {},
            "controllers": {},
            "middleware": {},
            "models": {},
            "routes": {},
            "utils": {},
            "app.js": None,
            "server.js": None
        },
        ".env": None,
        "package.json": None,
        "Dockerfile": None
    },
    "frontend": {
        "src": {
            "components": {},
            "pages": {},
            "context": {},
            "hooks": {},
            "services": {},
            "utils": {},
            "App.js": None,
            "index.js": None
        },
        "public": {},
        ".env": None,
        "package.json": None,
        "Dockerfile": None
    },
    "docker-compose.yml": None,
    ".gitignore": None,
    "README.md": None
}

def create_structure(base_path, struct):
    for name, content in struct.items():
        path = os.path.join(base_path, name)

        if content is None:
            # File
            with open(path, "w") as f:
                pass
            print(f"📄 Created file: {path}")
        else:
            # Folder
            os.makedirs(path, exist_ok=True)
            print(f"📁 Created folder: {path}")
            create_structure(path, content)

if __name__ == "__main__":
    root = os.getcwd()  # current directory
    create_structure(root, structure)
    print("\n✅ Project structure created successfully!")
