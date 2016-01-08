function SearchResult(title, subtitle, id, resultSort) {
    this.title = title;
    this.subtitle = subtitle;
    this.id = id;
    this.resultSort = resultSort;
}
SearchResult.prototype.toString = function () {
    return this.title;
};
