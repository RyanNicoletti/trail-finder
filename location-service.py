import folium
from time import sleep, time
import ast
import requests


def read_location():
    """Reads String of name/coordinate information from location.txt, then erases the string from the file. Returns the string in the form of a list of dictionaries."""
    sleep(2)
    with open('location.txt', 'r+') as file:
        data = file.read(1)
        if data:
            file.seek(0)
            data = file.read()
            file.truncate(0)
    if data:
        data = ast.literal_eval(data)
    return data


def get_map(parsed_data):
    """Takes list of dictionaries and creates Folium map. Creates markers and labels of trail points and exports map as static html page"""
    map = folium.Map(
        location=[parsed_data[0]["lat"], parsed_data[0]["lon"]],
        width=400,
        height=300
    )

    parsed_data = parsed_data[1:]

    bounds = []
    for loc in parsed_data:
        name = loc["name"]
        folium.Marker(
            location=[loc["lat"], loc["lon"]],
            popup=folium.Popup(f"{name}", max_width=len(
                f"name= {name}")*20)
        ).add_to(map)
        bounds.append([loc["lat"], loc["lon"]])

    map.fit_bounds(bounds, padding=(50, 50))
    map.save("map.html")


def write_html():
    """
    Writes Folium map html file into a text file that Chris's app can read.
    """
    with open('map.html', 'r') as html_file:
        text = html_file.read()
        with open('map.txt', 'w') as file:
            file.write(text)


def main_driver():
    end_time = time() + (60*5)
    while time() < end_time:
        parsed = read_location()
        if parsed:
            get_map(parsed)
            write_html()


if __name__ == "__main__":
    main_driver()