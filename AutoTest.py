import requests
import json
from datetime import datetime, timedelta, timezone

BASE_URL = "http://localhost:3000"  # Adjust as needed if different

# Global variable to store the authentication token
AUTH_TOKEN = None

# Helper function to print the response in a readable format
def print_response(response):
    try:
        print(json.dumps(response.json(), indent=4))
    except ValueError:
        print(response.text)

# Function to authenticate and retrieve a token for new registered employee
def authenticate():
    global AUTH_TOKEN
    url = f"{BASE_URL}/employees/login"
    credentials = {
        "email": "john.doe@example.com",  
        "password": "securepassword123"   
    }

    response = requests.post(url, json=credentials)
    if response.status_code == 200:
        response_data = response.json()
        AUTH_TOKEN = response_data.get("token")  # Store the token globally
        print("Authentication successful!")
        print_response(response)
    else:
        print(f"Failed to authenticate. Status Code: {response.status_code}, Error: {response.json()}")
        exit(1)

# Function to create a new organization and return its ID
def create_organization():
    url = f"{BASE_URL}/organizations/new"
    data = {
        "orgName": "GusCoffee Inc",
        "orgEmail": "coffee@example.com",
        "establishDate": "2022-01-01",
        "orgPhone": "123-1245-1234"
    }
    headers = {"Authorization": f"Bearer {AUTH_TOKEN}"}  # Add the token to headers
    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 201:
        response_data = response.json()
        print_response(response)
        return response_data.get("_id")
    else:
        print(f"Failed to create organization. Status Code: {response.status_code}, Error: {response.json()}")
        return None

# Function to create a new site using the organization ID
def create_site(org_id):
    if not org_id:
        print("Organization ID is required to create a site.")
        return None

    url = f"{BASE_URL}/sites/new"
    data = {
        "siteName": "OC Store",
        "orgID": org_id, # Use the organization ID from the created organization
        "address": "Temp Addy"
    }
    headers = {"Authorization": f"Bearer {AUTH_TOKEN}"}  # Add the token to headers
    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 201:
        response_data = response.json()
        print_response(response)
        return response_data.get("_id")
    else:
        print(f"Failed to create site. Status Code: {response.status_code}, Error: {response.json()}")
        return None

# Function to create a new employee using the organization ID
def create_employee(org_id):
    if not org_id:
        print("Organization ID is required to create an employee.")
        return None

    url = f"{BASE_URL}/employees/register"
    data = {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "orgID": org_id,  # Use the organization ID from the created organization
        "password": "securepassword123"
    }
    headers = {"Authorization": f"Bearer {AUTH_TOKEN}"}  # Add the token to headers
    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 201:
        response_data = response.json()
        print_response(response)
        return response_data.get("employee").get("_id")
    else:
        print(f"Failed to create employee. Status Code: {response.status_code}, Error: {response.json()}")
        return None

# Function to create two weeks of shifts, one week before and one week after today
def create_shifts(employee_id, site_id):
    if not site_id:
        print("Site ID is required to create shifts.")
        return None

    url = f"{BASE_URL}/shifts/new"
    headers = {"Authorization": f"Bearer {AUTH_TOKEN}"}  # Add the token to headers

    # Get today's date in UTC
    today = datetime.now(timezone.utc)

    # Create shifts for 7 days before today and 7 days after today
    for day_delta in range(1, 8):
        shift_date = today + timedelta(days=day_delta)
        start_time = shift_date.replace(hour=8, minute=0, second=0, microsecond=0)
        end_time = shift_date.replace(hour=16, minute=0, second=0, microsecond=0)

        # Format time to match expected format without redundant suffix
        data = {
            "shiftName": f"Shift {shift_date.strftime('%Y-%m-%d')}",
            "employeeID": employee_id,  # This can be None if the shift is unassigned
            "startTime": start_time.isoformat(),  # Correctly formatted ISO timestamp
            "endTime": end_time.isoformat(),      # Correctly formatted ISO timestamp
            "siteID": site_id  # Use the site ID from the created site
        }
        
        response = requests.post(url, json=data, headers=headers)

        if response.status_code == 201:
            response_data = response.json()
            print_response(response)
        else:
            print(f"Failed to create shift for {shift_date.strftime('%Y-%m-%d')}. Status Code: {response.status_code}, Error: {response.json()}")

# Example call
if __name__ == "__main__":


    # Create a new organization and store its ID
    organization_id = create_organization()

    # Use the organization ID to create a new site
    site_id = create_site(organization_id)

    # Use the organization ID to create a new employee
    employee_id = create_employee(organization_id)

    # Authenticate and get the token
    authenticate()

    # Use the employee ID and site ID to create a new shift
    create_shifts(employee_id, site_id)
