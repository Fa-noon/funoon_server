class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    //1(a)- Filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //1(b)-Advance Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(lte|gte|lt|gt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    //2-Sorting
    if (this.queryString.sort) {
      const reqQuery = this.queryString.sort.split(',').join(' ');
      console.log(reqQuery);
      this.query = this.query.sort(reqQuery);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limit() {
    //3-Field Limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  page() {
    //4-Paging
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skipValue = (page - 1) * limit;

    this.query = this.query.skip(skipValue).limit(limit);
    return this;
  }
}
export default APIFeatures;
