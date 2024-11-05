class ApiFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      const queryObj = { ...this.queryString };
      const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
      excludedFields.forEach(el => delete queryObj[el]);
    

      // Elimina los campos vacíos
      Object.keys(queryObj).forEach(key => {
        if (queryObj[key] === '') {
          delete queryObj[key];
        }
      });
      
        // Procesar filtros de stock
        if (queryObj.stock) {
          switch (queryObj.stock) {
              case 'inStock':
                  this.query = this.query.where('stock').gt(5);
                  break;
              case 'lowStock':
                  this.query = this.query.where('stock').gt(0).lte(5);
                  break;
              case 'outOfStock':
                  this.query = this.query.where('stock').equals(0);
                  break;
          }
          delete queryObj.stock;
      }
      
      if (this.queryString.search) {
        const searchRegex = new RegExp(this.queryString.search, 'i');
        this.query = this.query.or([
            { nombre: searchRegex },
            { descripcion: searchRegex }
        ]);
    }
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
    }
  
    sort() {
      if (this.queryString.sort) {
          const sortBy = this.queryString.sort.split(',').join(' ');
          this.query = this.query.sort(sortBy);
      } else {
          this.query = this.query.sort('-createdAt');
      }
      return this;
  }
  
    limitFields() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
  
      return this;
    }
  
    paginate() {
      const page = parseInt(this.queryString.page) || 1;
      const limit = parseInt(this.queryString.limit) || 12;
      const skip = (page - 1) * limit;

      this.query = this.query.skip(skip).limit(limit);
      this.pagination = { page, limit, skip };

      return this;
  }
  
    search() {
      if (this.queryString.search) {
        const searchRegex = new RegExp(this.queryString.search, 'i');
        this.query = this.query.or([
          { nombre: searchRegex },
          { descripcion: searchRegex },
          { categoria: searchRegex }
        ]);
      }
      return this;
    }
  }
  
  module.exports = ApiFeatures;