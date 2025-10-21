document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll('a[data-country-item]').forEach(function (a) {
        const slug = a.getAttribute('data-slug');
        if (slug) a.href = `/country/${slug.toLowerCase()}`;
    });

    // Must be added to the Webflow Item these attributes:
    // data-country-item=true
    // data-slug={Country.Name}

});