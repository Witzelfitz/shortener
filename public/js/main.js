document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('shorten-form');
    const linksList = document.getElementById('links-list');
  
    // Fetch all links on page load using the '/all' endpoint
    fetchLinks();
  
    // Handle form submission to shorten a new URL
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const urlInput = document.getElementById('original-link');
      const originalLink = urlInput.value;
  
      try {
        const response = await fetch('/api/urls', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ originalUrl: originalLink })
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Error shortening link');
        }
  
        // Clear the input field and refresh the links list upon success
        urlInput.value = '';
        fetchLinks();
      } catch (error) {
        console.error('Error:', error);
      }
    });
  
    // Function to fetch all URLs from the backend and update the list
    async function fetchLinks() {
      try {
        const response = await fetch('/api/urls/all');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Error fetching links');
        }
        const links = await response.json();
  
        // Clear current list content
        linksList.innerHTML = '';
  
        if (links.length === 0) {
          linksList.innerHTML = '<li>No links found.</li>';
          return;
        }
  
        // Render each link into the list
        links.forEach((link) => {
          const li = document.createElement('li');
          // Assuming each link object contains: { shortUrl, originalUrl, clicks, isActive }
          li.innerHTML = `
            <p>Original: <a href="${link.originalUrl}" target="_blank" rel="noopener noreferrer">${link.originalUrl}</a></p>
            <p>Shortened: <a href="/api/urls/${link.shortUrl}" target="_blank" rel="noopener noreferrer">${link.shortUrl}</a></p>
            <p>Clicks: ${link.clicks}</p>
            <p>Status: ${link.isActive ? 'Active' : 'Inactive'}</p>
          `;
          linksList.appendChild(li);
        });
      } catch (error) {
        console.error('Error:', error);
        linksList.innerHTML = '<li>Error loading links.</li>';
      }
    }
  });