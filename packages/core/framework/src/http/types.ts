import type { NextFunction, Request, Response } from "express"
import { ZodNullable, ZodObject, ZodOptional } from "zod"

import {
  FindConfig,
  MedusaPricingContext,
  RequestQueryFields,
} from "@medusajs/types"
import { MedusaContainer } from "../container"
import { RestrictedFields } from "./utils/restricted-fields"

/**
 * List of all the supported HTTP methods
 */
export const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD",
] as const

export type RouteVerb = (typeof HTTP_METHODS)[number]
export type MiddlewareVerb = "USE" | "ALL" | RouteVerb

type SyncRouteHandler = (req: MedusaRequest, res: MedusaResponse) => void

export type AsyncRouteHandler = (
  req: MedusaRequest,
  res: MedusaResponse
) => Promise<void>

export type RouteHandler = SyncRouteHandler | AsyncRouteHandler

export type RouteImplementation = {
  method?: RouteVerb
  handler: RouteHandler
}

export type RouteConfig = {
  optedOutOfAuth?: boolean
  routeType?: "admin" | "store" | "auth"
  shouldAppendAdminCors?: boolean
  shouldAppendStoreCors?: boolean
  shouldAppendAuthCors?: boolean
  routes?: RouteImplementation[]
}

export type MiddlewareFunction =
  | MedusaRequestHandler
  | ((...args: any[]) => any)

export type MedusaErrorHandlerFunction = (
  error: any,
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => Promise<void> | void

export type ParserConfigArgs = {
  sizeLimit?: string | number | undefined
  preserveRawBody?: boolean
}

export type ParserConfig = false | ParserConfigArgs

export type MiddlewareRoute = {
  method?: MiddlewareVerb | MiddlewareVerb[]
  matcher: string | RegExp
  bodyParser?: ParserConfig
  middlewares?: MiddlewareFunction[]
}

export type MiddlewaresConfig = {
  errorHandler?: false | MedusaErrorHandlerFunction
  routes?: MiddlewareRoute[]
}

export type RouteDescriptor = {
  absolutePath: string
  relativePath: string
  route: string
  priority: number
  config?: RouteConfig
}

export type GlobalMiddlewareDescriptor = {
  config?: MiddlewaresConfig
}

export interface MedusaRequest<
  Body = unknown,
  QueryFields = Record<string, unknown>
> extends Request<{ [key: string]: string }, any, Body> {
  validatedBody: Body
  validatedQuery: RequestQueryFields & QueryFields
  /**
   * TODO: shouldn't this correspond to returnable fields instead of allowed fields? also it is used by the cleanResponseData util
   */
  allowedProperties: string[]
  /**
   * An object containing the select, relation, skip, take and order to be used with medusa internal services
   */
  listConfig: FindConfig<unknown>
  /**
   * An object containing the select, relation to be used with medusa internal services
   */
  retrieveConfig: FindConfig<unknown>

  /**
   * An object containing fields and variables to be used with the remoteQuery
   * 
   * @version 2.1.4
   */
  queryConfig: {
    fields: string[]
    pagination: { order?: Record<string, string>; skip: number; take?: number }
  }

  /**
   * @deprecated Use {@link queryConfig} instead.
   */
  remoteQueryConfig: MedusaRequest["queryConfig"]

  /**
   * An object containing the fields that are filterable e.g `{ id: Any<String> }`
   */
  filterableFields: QueryFields
  includes?: Record<string, boolean>

  /**
   * An array of fields and relations that are allowed to be queried, this can be set by the
   * consumer as part of a middleware and it will take precedence over the req.allowed set
   * by the api
   */
  allowed?: string[]
  errors: string[]
  scope: MedusaContainer
  session?: any
  rawBody?: any
  requestId?: string

  restrictedFields?: RestrictedFields

  /**
   * An object that carries the context that is used to calculate prices for variants
   */
  pricingContext?: MedusaPricingContext
  /**
   * A generic context object that can be used across the request lifecycle
   */
  context?: Record<string, any>

  /**
   * Custom validator to validate the `additional_data` property in
   * requests that allows for additional_data
   */
  additionalDataValidator?: ZodOptional<ZodNullable<ZodObject<any, any>>>
}

export interface AuthContext {
  actor_id: string
  actor_type: string
  auth_identity_id: string
  app_metadata: Record<string, unknown>
}

export interface PublishableKeyContext {
  key: string
  sales_channel_ids: string[]
}

export interface AuthenticatedMedusaRequest<
  Body = unknown,
  QueryFields = Record<string, unknown>
> extends MedusaRequest<Body, QueryFields> {
  auth_context: AuthContext
  publishable_key_context?: PublishableKeyContext
}

export interface MedusaStoreRequest<
  Body = unknown,
  QueryFields = Record<string, unknown>
> extends MedusaRequest<Body, QueryFields> {
  auth_context?: AuthContext
  publishable_key_context: PublishableKeyContext
}

export type MedusaResponse<Body = unknown> = Response<Body>

export type MedusaNextFunction = NextFunction

export type MedusaRequestHandler<Body = unknown, Res = unknown> = (
  req: MedusaRequest<Body>,
  res: MedusaResponse<Res>,
  next: MedusaNextFunction
) => Promise<void> | void
