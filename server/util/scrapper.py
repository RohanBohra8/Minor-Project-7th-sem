from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

def render_page(url):
# Start Playwright in a synchronous context
    with sync_playwright() as p:
        # Launch a Chromium browser in headless mode
        browser = p.chromium.launch(headless=True)
        # Create a new browser context
        context = browser.new_context()
        # Open a new page in the browser
        page = context.new_page()
        
        # Browse the URL
        page.goto(url)

        with open('./test/test.html', 'w', encoding="utf-8") as file:
            file.write(page.content())

        # print(page.content())

        return page.content()

url = "https://medium.com/@kasata/navigating-the-software-engineering-career-path-a-comprehensive-guide-d4ac4ed52a4b"

def add_to_file(text):
    with open('./test/test.txt', 'a') as file:
        file.write(text)


def scrape_medium(url):
    
    html_content = render_page(url)
    # response = requests.get(url)
    soup = BeautifulSoup(html_content, 'html.parser')
    title = soup.find('title')
    # print(response.text)

    articles = soup.find_all('p', class_='pw-post-body-paragraph')

    for article in articles:
        add_to_file(article.text)
        add_to_file('\n')
        print(article.text)
    print(articles)

scrape_medium(url)






