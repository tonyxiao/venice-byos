import type {ProviderFromRouter, RouterMeta} from '@supaglue/vdk'
import {
  proxyCallProvider,
  remoteProcedure,
  trpc,
  z,
  zPaginationParams,
} from '@supaglue/vdk'
import * as commonModels from './commonModels'

export {commonModels}

function oapi(meta: NonNullable<RouterMeta['openapi']>): RouterMeta {
  return {openapi: {...meta, path: `/crm/v2${meta.path}`}}
}

export const crmRouter = trpc.router({
  countEntity: remoteProcedure
    .meta(oapi({method: 'GET', path: '/{entity}/_count'}))
    .input(z.object({entity: z.string()}))
    .output(z.object({count: z.number()}))
    .query(async ({input, ctx}) => proxyCallProvider({input, ctx})),
  listContacts: remoteProcedure
    .meta(oapi({method: 'GET', path: '/contact'}))
    .input(zPaginationParams.nullish())
    .output(
      z.object({
        items: z.array(commonModels.contact),
        nextCursor: z.string().nullish(),
      }),
    )
    .query(async ({input, ctx}) => proxyCallProvider({input, ctx})),
  getContact: remoteProcedure
    .meta(oapi({method: 'GET', path: '/contact/{id}'}))
    .input(z.object({id: z.string()}))
    .output(z.object({record: commonModels.contact, raw: z.unknown()}))
    .query(async ({input, ctx}) => proxyCallProvider({input, ctx})),
  getCompany: remoteProcedure
    .meta(oapi({method: 'GET', path: '/company/{id}'}))
    .input(z.object({id: z.string()}))
    .output(z.object({record: commonModels.company, raw: z.unknown()}))
    .query(async ({input, ctx}) => proxyCallProvider({input, ctx})),
  metadataListStandardObjects: remoteProcedure
    .meta(oapi({method: 'GET', path: '/metadata/objects/standard'}))
    .input(z.void())
    .output(z.array(commonModels.metaStandardObject))
    .query(async ({input, ctx}) => proxyCallProvider({input, ctx})),
  metadataListCustomObjects: remoteProcedure
    .meta(oapi({method: 'GET', path: '/metadata/objects/custom'}))
    .input(z.void())
    .output(z.array(commonModels.metaCustomObject))
    .query(async ({input, ctx}) => proxyCallProvider({input, ctx})),
  metadataListProperties: remoteProcedure
    .meta(oapi({method: 'GET', path: '/metadata/properties'}))
    .input(
      z.object({
        type: z.enum(['standard', 'custom']),
        name: z.string(),
      }),
    )
    .output(z.array(commonModels.metaProperty))
    .query(async ({input, ctx}) => proxyCallProvider({input, ctx})),
})

export type CRMProvider<TInstance> = ProviderFromRouter<
  typeof crmRouter,
  TInstance
>
