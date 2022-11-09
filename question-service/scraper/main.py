import json
import pickle
import time
import sys

import bs4
import colorama
import requests
from colorama import Back, Fore
from ebooklib import epub
from pymongo import MongoClient
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from utils import *
from decouple import config
# Get upto which problem it is already scraped from track.conf file


conn_str = config('DB_CLOUD_URI1')

print(conn_str)

client = MongoClient(conn_str, serverSelectionTimeoutMS=5000)

try :
    client.server_info()
    questions_db = client.questionmodels.questionmodels
    question_type_db = client.questionmodels.question_type_model
    print("Connected to database")
except Exception as e:
    print("Unable to connect to database")

TRACKER_FILENAME = "tracker.conf"

def read_tracker():
    with open(TRACKER_FILENAME, "r") as f:
        return int(f.readline())
    
completed_upto = read_tracker()

def update_tracker(num):
    with open(TRACKER_FILENAME, "w") as f:
        f.write(str(num))
        
# Initialize Colorama
colorama.init(autoreset=True)

# Setup Selenium Webdriver
CHROMEDRIVER_PATH = r"./driver/chromedriver.exe"

options = Options()
options.headless = True
# Disable Warning, Error and Info logs
# Show only fatal errors
options.add_argument("--log-level=3")
driver = webdriver.Chrome(executable_path=CHROMEDRIVER_PATH, options=options)

# Get upto which problem it is already scraped from track.conf file
completed_upto = read_tracker()

def download(frontend_question_id, problem_num, url, title, solution_slug, difficulty, title_slug):
    print(
        Fore.BLACK
        + Back.CYAN
        + f"Fetching problem num "
        + Back.YELLOW
        + f" {problem_num} "
        + Back.CYAN
        + " with url "
        + Back.YELLOW
        + f" {url} "
    )
    n = len(title)

    try:
        driver.get(url)
        # Wait 20 secs or until div with id initial-loading disappears
        element = WebDriverWait(driver, 20).until(
            EC.invisibility_of_element_located((By.ID, "initial-loading"))
        )
        # Get current tab page source
        html = driver.page_source
        soup = bs4.BeautifulSoup(html, "html.parser")

        # Construct HTML
        title_decorator = "*" * n
        
        problem_html = (
            str(soup.find("div", {"class": "content__u3I1 question-content__JfgR"}))
            + "<br><br><hr><br>"
        )
        
        # print(problem_html)

        related_topic_element = driver.find_element(By.CLASS_NAME, "e5i1odf0");
        
        related_topic_element.click()
        
        topic_elements = soup.find_all("a", {"class" : "topic-tag__1jni"})
        
        print("Len of topic elements :" + str(len(topic_elements)))
        
        topics = []
        
        for topic in topic_elements:
            topic_href = topic['href']
            q_type = topic_href.split("/")[2]
            question_type_db.insert_one({
                'question_type': q_type,
                'question_frontend_id': frontend_question_id,
                'question_difficulty': difficulty
            })
        
        questions_db.insert_one({
            'question_frontend_id': frontend_question_id,
            'question_title': title,
            'question_title_slug': title_slug,
            'question_text': problem_html,
            'question_difficulty': difficulty
        })
            
            
        # Update upto which the problem is downloaded
        update_tracker(problem_num)
        print(
            Fore.BLACK
            + Back.GREEN
            + f"Writing problem num "
            + Back.YELLOW
            + f" {problem_num} "
            + Back.GREEN
            + " with url "
            + Back.YELLOW
            + f" {url} "
        )
        print(Fore.BLACK + Back.GREEN + " successfull ")
        # print(f"Writing problem num {problem_num} with url {url} successfull")

    except Exception as e:
        print(Back.RED + f" Failed Writing!!  {e} ")
        driver.quit()


def main():

    numEasy = int(sys.argv[1]) if len(sys.argv) > 1 else 200
    numMedium = int(sys.argv[2]) if len(sys.argv) > 2 else 200
    numHard = int(sys.argv[3]) if len(sys.argv) > 3 else 200
    
    easyCount = 0
    mediumCount = 0
    hardCount = 0
    
    print(str(numEasy) + " " + str(numMedium) + " " + str(numHard))
    
    # Leetcode API URL to get json of problems on algorithms categories
    ALGORITHMS_ENDPOINT_URL = "https://leetcode.com/api/problems/algorithms/"

    # Problem URL is of format ALGORITHMS_BASE_URL + question__title_slug
    # If question__title_slug = "two-sum" then URL is https://leetcode.com/problems/two-sum
    ALGORITHMS_BASE_URL = "https://leetcode.com/problems/"

    # Load JSON from API
    algorithms_problems_json = requests.get(ALGORITHMS_ENDPOINT_URL).content
    algorithms_problems_json = json.loads(algorithms_problems_json)

    # List to store question_title_slug
    links = []
    for child in algorithms_problems_json["stat_status_pairs"]:
        # Only process free problems
        if not child["paid_only"]:
            question__title_slug = child["stat"]["question__title_slug"]
            question__article__slug = child["stat"]["question__article__slug"]
            question__title = child["stat"]["question__title"]
            frontend_question_id = child["stat"]["frontend_question_id"]
            difficulty = child["difficulty"]["level"]
            links.append(
                (
                    question__title_slug,
                    difficulty,
                    frontend_question_id,
                    question__title,
                    question__article__slug,
                )
            )

    # Sort by difficulty follwed by problem id in ascending order
    # links = sorted(links, key=lambda x: (x[1]), reverse=True)
    try:
        for i in range(completed_upto + 1, len(links)):
            print(links[i])
            (
                question__title_slug,
                difficulty,
                frontend_question_id,
                question__title,
                question__article__slug,
            ) = links[i]
            url = ALGORITHMS_BASE_URL + question__title_slug
            
            print("Difficulty " + str(difficulty) + " type " + str(type(difficulty)))
            
            # TODO : Implement get question answer
            if difficulty == 3 and hardCount < numHard:
                hardCount += 1
            elif difficulty == 2 and mediumCount < numMedium:
                mediumCount += 1
            elif difficulty == 1 and easyCount < numEasy:
                easyCount += 1
            else:
                continue
            
            download(frontend_question_id, i,url, question__title, question__title_slug, difficulty, question__title_slug)

            # Sleep for 20 secs for each problem and 2 minns after every 30 problems
            if i % 30 == 0:
                print(f"Sleeping 10 secs\n")
                time.sleep(10)
            else:
                print(f"Sleeping 2 secs\n")
                time.sleep(2)

    finally:
        # Close the browser after download
        driver.quit()

if __name__ == "__main__":
    main()
