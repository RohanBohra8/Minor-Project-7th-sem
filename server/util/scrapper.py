from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

def render_page(url):
# Start Playwright in a synchronous context
    with sync_playwright() as p:
        
        # Launching Chromium
        browser = p.chromium.launch(headless=True)

        # Create a new browser context
        context = browser.new_context()

        # Open a new page in the browser
        page = context.new_page()
        
        # Browse the URL
        page.goto(url)

        # with open('test.html', 'w', encoding="utf-8") as file:
        #     file.write(page.content())

        # print(page.content())

        return page.content()

# url = "https://medium.com/@thecodingteacher_52591/why-nextjs-sucks-0352de93071b"

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
    images = soup.find_all('img', attrs={'loading': 'eager'})
    title = soup.find('h1', attrs={'data-testid': 'storyTitle'}).text
    
    image_url = images[0]['src']
    article_content = ''

    for article in articles:
        # add_to_file(article.text)
        # add_to_file('\n')
        article_content += article.text
        # print(article.text)

    return article_content, title, image_url





