import { db } from "@/lib/db";

/**
 * Generic Repository Base Class
 * Provides common CRUD operations and pagination
 */
export class GenericRepository {
  constructor(modelName, serializer) {
    this.modelName = modelName;
    this.db = db;
    this.model = db[modelName];
    this.serializer = serializer;
  }

  /**
   * Find a single record by ID
   */
  async findById(id, include = {}) {
    const record = await this.model.findUnique({
      where: { id },
      ...(include && { include })
    });
    return this.serializer ? this.serializer(record) : record;
  }

  /**
   * Find all records with optional filtering and pagination
   */
  async findAll(options = {}) {
    const {
      where = {},
      include = {},
      orderBy = { createdAt: 'desc' },
      page = 1,
      limit = 10,
    } = options;

    const skip = (page - 1) * limit;

    const [records, total] = await this.db.$transaction([
      this.model.findMany({
        where,
        include,
        orderBy,
        take: limit,
        skip,
      }),
      this.model.count({ where }),
    ]);

    return {
      data: this.serializer ? records.map(this.serializer) : records,
      metadata: {
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Create a new record
   */
  async create(data, select = null) {
    const options = select ? { data, select } : { data };
    const record = await this.model.create(options);
    return this.serializer ? this.serializer(record) : record;
  }

  /**
   * Update an existing record
   */
  async update(id, data, select = null) {
    const options = select ? { where: { id }, data, select } : { where: { id }, data };
    const record = await this.model.update(options);
    return this.serializer ? this.serializer(record) : record;
  }

  /**
   * Delete a record by ID
   */
  async delete(id) {
    const record = await this.model.delete({
      where: { id },
    });
    return this.serializer ? this.serializer(record) : record;
  }

  /**
   * Count records matching a condition
   */
  async count(where = {}) {
    return await this.model.count({ where });
  }

  /**
   * Find records by a specific field
   */
  async findBy(field, value, include = {}) {
    const records = await this.model.findMany({
      where: { [field]: value },
      ...(include && { include })
    });
    return this.serializer ? records.map(this.serializer) : records;
  }

  /**
   * Find one record by a specific field
   */
  async findOneBy(field, value, include = {}) {
    const record = await this.model.findUnique({
      where: { [field]: value },
      ...(include && { include })
    });
    return this.serializer ? this.serializer(record) : record;
  }
}

/**
 * Factory function to create specialized repositories
 */
export function createRepository(modelName, serializer = null) {
  return new GenericRepository(modelName, serializer);
}