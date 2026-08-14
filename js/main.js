// Set current year in the footer
document.getElementById("year").textContent = new Date().getFullYear();

// Show which CloudFront edge region is serving the page (X-Edge-Location header)
fetch(window.location.href, { method: "HEAD" })
  .then((res) => {
    const region = res.headers.get("X-Edge-Location");
    if (region) {
      document.getElementById("deploy-info").textContent =
        `Served from CloudFront edge: ${region}`;
    }
  })
  .catch(() => {
    // Header not exposed via CORS or not running through CloudFront — no problem
  });
