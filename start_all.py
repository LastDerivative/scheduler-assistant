import subprocess
import pathlib

def run_commands():
    try:
        # Get the root path from where the script is run
        root_path = pathlib.Path(__file__).parent.resolve()

        # Start MongoDB server in a new command prompt
        print("Starting MongoDB server...")
        subprocess.Popen("start cmd /k mongod", shell=True, cwd=root_path)
        
        # Start the Node.js server in a new command prompt
        print("Starting Node.js server...")
        subprocess.Popen("start cmd /k node index.js", shell=True, cwd=root_path)

        # Change directory into client and run npm dev server in a new command prompt
        print("Starting client...")
        client_path = root_path / "client"
        subprocess.Popen("start cmd /k npm run dev", shell=True, cwd=client_path)

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    run_commands()
