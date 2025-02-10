import { expectTypeOf } from "expect-type"
import { model } from "../../dml"
import { MedusaService } from "../medusa-service"
import { InferTypeOf } from "@medusajs/types"

const Blog = model.define("Blog", {
  id: model.text(),
  title: model.text(),
  description: model.text().nullable(),
})

type BlogDTO = {
  id: number
  title: string
}

type CreateBlogDTO = {
  title: string | null
}

const baseRepoMock = {
  serialize: jest.fn().mockImplementation((item) => item),
  transaction: (task) => task("transactionManager"),
  getFreshManager: jest.fn().mockReturnThis(),
}

const containerMock = {
  baseRepository: baseRepoMock,
  mainModelMockRepository: baseRepoMock,
  otherModelMock1Repository: baseRepoMock,
  otherModelMock2Repository: baseRepoMock,
  mainModelMockService: {
    retrieve: jest.fn().mockResolvedValue({ id: "1", name: "Item" }),
    list: jest.fn().mockResolvedValue([{ id: "1", name: "Item" }]),
    delete: jest.fn().mockResolvedValue(undefined),
    softDelete: jest.fn().mockResolvedValue([[], {}]),
    restore: jest.fn().mockResolvedValue([[], {}]),
  },
  otherModelMock1Service: {
    retrieve: jest.fn().mockResolvedValue({ id: "1", name: "Item" }),
    list: jest.fn().mockResolvedValue([{ id: "1", name: "Item" }]),
    delete: jest.fn().mockResolvedValue(undefined),
    softDelete: jest.fn().mockResolvedValue([[], {}]),
    restore: jest.fn().mockResolvedValue([[], {}]),
  },
  otherModelMock2Service: {
    retrieve: jest.fn().mockResolvedValue({ id: "1", name: "Item" }),
    list: jest.fn().mockResolvedValue([{ id: "1", name: "Item" }]),
    delete: jest.fn().mockResolvedValue(undefined),
    softDelete: jest.fn().mockResolvedValue([[], {}]),
    restore: jest.fn().mockResolvedValue([[], {}]),
  },
}

describe("Medusa Service typings", () => {
  describe("create<Service>", () => {
    test("type-hint model properties", () => {
      class BlogService extends MedusaService({ Blog }) {}
      const blogService = new BlogService(containerMock)

      expectTypeOf(blogService.createBlogs).parameters.toEqualTypeOf<
        | [
            Partial<{
              id: string | undefined
              title: string | undefined
              description: string | null | undefined
            }>,
            ...rest: any[]
          ]
        | [
            Partial<{
              id: string | undefined
              title: string | undefined
              description: string | null | undefined
            }>[],
            ...rest: any[]
          ]
      >()
      expectTypeOf(blogService.createBlogs).returns.toEqualTypeOf<
        Promise<InferTypeOf<typeof Blog>> | Promise<InferTypeOf<typeof Blog>[]>
      >()
    })

    test("type-hint DTO properties", () => {
      class BlogService extends MedusaService<{ Blog: { dto: BlogDTO } }>({
        Blog,
      }) {}
      const blogService = new BlogService(containerMock)

      expectTypeOf(blogService.createBlogs).parameters.toEqualTypeOf<
        | [Partial<BlogDTO>, ...rest: any[]]
        | [Partial<BlogDTO>[], ...rest: any[]]
      >()
      expectTypeOf(blogService.createBlogs).returns.toEqualTypeOf<
        Promise<BlogDTO> | Promise<BlogDTO[]>
      >()
    })

    test("type-hint force overridden properties", () => {
      class BlogService extends MedusaService<{ Blog: { dto: BlogDTO } }>({
        Blog,
      }) {
        // @ts-expect-error
        async createBlogs(_: CreateBlogDTO): Promise<BlogDTO> {
          return {} as BlogDTO
        }
      }
      const blogService = new BlogService(containerMock)

      expectTypeOf(blogService.createBlogs).parameters.toEqualTypeOf<
        [CreateBlogDTO]
      >()
      expectTypeOf(blogService.createBlogs).returns.toEqualTypeOf<
        Promise<BlogDTO>
      >()
    })

    test("define custom DTO for inputs", () => {
      class BlogService extends MedusaService<{
        Blog: { dto: BlogDTO; inputDto: Omit<BlogDTO, "id"> }
      }>({
        Blog,
      }) {}
      const blogService = new BlogService(containerMock)

      expectTypeOf(blogService.createBlogs).parameters.toEqualTypeOf<
        | [Partial<{ title: string | undefined }>, ...rest: any[]]
        | [Partial<{ title: string | undefined }>[], ...rest: any[]]
      >()
      expectTypeOf(blogService.createBlogs).returns.toEqualTypeOf<
        Promise<BlogDTO> | Promise<BlogDTO[]>
      >()
    })
  })

  describe("update<Service>", () => {
    test("type-hint model properties", () => {
      class BlogService extends MedusaService({ Blog }) {}
      const blogService = new BlogService(containerMock)

      expectTypeOf(blogService.updateBlogs).parameters.toEqualTypeOf<
        | [
            Partial<{
              id: string | undefined
              title: string | undefined
              description: string | null | undefined
            }>,
            ...rest: any[]
          ]
        | [
            (
              | Partial<{
                  id: string | undefined
                  title: string | undefined
                  description: string | null | undefined
                }>[]
              | {
                  selector: Record<string, any>
                  data:
                    | Partial<{
                        id: string | undefined
                        title: string | undefined
                        description: string | null | undefined
                      }>
                    | Partial<{
                        id: string | undefined
                        title: string | undefined
                        description: string | null | undefined
                      }>[]
                }
              | {
                  selector: Record<string, any>
                  data:
                    | Partial<{
                        id: string | undefined
                        title: string | undefined
                        description: string | null | undefined
                      }>
                    | Partial<{
                        id: string | undefined
                        title: string | undefined
                        description: string | null | undefined
                      }>[]
                }[]
            ),
            ...rest: any[]
          ]
      >()
      expectTypeOf(blogService.updateBlogs).returns.toEqualTypeOf<
        Promise<InferTypeOf<typeof Blog>> | Promise<InferTypeOf<typeof Blog>[]>
      >()
    })

    test("type-hint DTO properties", () => {
      class BlogService extends MedusaService<{ Blog: { dto: BlogDTO } }>({
        Blog,
      }) {}
      const blogService = new BlogService(containerMock)

      expectTypeOf(blogService.updateBlogs).parameters.toEqualTypeOf<
        | [Partial<BlogDTO>, ...rest: any[]]
        | [
            (
              | Partial<BlogDTO>[]
              | {
                  selector: Record<string, any>
                  data: Partial<BlogDTO> | Partial<BlogDTO>[]
                }
              | {
                  selector: Record<string, any>
                  data: Partial<BlogDTO> | Partial<BlogDTO>[]
                }[]
            ),
            ...rest: any[]
          ]
      >()
      expectTypeOf(blogService.updateBlogs).returns.toEqualTypeOf<
        Promise<BlogDTO> | Promise<BlogDTO[]>
      >()
    })

    test("type-hint force overridden properties", () => {
      class BlogService extends MedusaService<{ Blog: { dto: BlogDTO } }>({
        Blog,
      }) {
        // @ts-expect-error
        async updateBlogs(_: string, __: CreateBlogDTO): Promise<BlogDTO> {
          return {} as BlogDTO
        }
      }
      const blogService = new BlogService(containerMock)

      expectTypeOf(blogService.updateBlogs).parameters.toEqualTypeOf<
        [id: string, data: CreateBlogDTO]
      >()
      expectTypeOf(blogService.updateBlogs).returns.toEqualTypeOf<
        Promise<BlogDTO>
      >()
    })

    test("define custom DTO for inputs", () => {
      class BlogService extends MedusaService<{
        Blog: { dto: BlogDTO; inputDto: Omit<BlogDTO, "id"> }
      }>({
        Blog,
      }) {}
      const blogService = new BlogService(containerMock)

      expectTypeOf(blogService.updateBlogs).parameters.toEqualTypeOf<
        | [Partial<{ title: string | undefined }>, ...rest: any[]]
        | [
            (
              | Partial<{ title: string | undefined }>[]
              | {
                  selector: Record<string, any>
                  data:
                    | Partial<{ title: string | undefined }>
                    | Partial<{ title: string | undefined }>[]
                }
              | {
                  selector: Record<string, any>
                  data:
                    | Partial<{ title: string | undefined }>
                    | Partial<{ title: string | undefined }>[]
                }[]
            ),
            ...rest: any[]
          ]
      >()
      expectTypeOf(blogService.createBlogs).returns.toEqualTypeOf<
        Promise<BlogDTO> | Promise<BlogDTO[]>
      >()
    })
  })
})
