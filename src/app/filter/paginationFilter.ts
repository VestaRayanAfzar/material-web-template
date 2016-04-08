export function paginationFilter() {
    return (items, page, limit, total, loadMore) => {
        total = total || items.length;
        if (!items) {
            return items;
        }

        var starIndex = (page - 1) * limit;
        if (starIndex >= total) {
            starIndex = 0;
        }

        if (starIndex >= items.length && starIndex < total) {
            typeof loadMore == 'function' && loadMore(page);
        }

        return items.slice(starIndex, starIndex + limit);
    }
}
