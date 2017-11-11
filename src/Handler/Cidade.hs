{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

-- curl -X POST -v https://haskalpha-romefeller.c9users.io/cidade -d '{"nome":"Rio de Janeiro", "estadoId": 2}'
module Handler.Cidade where
    
import Import
import Network.HTTP.Types.Status
import Database.Persist.Postgresql

postCidadeR :: Handler TypedContent
postCidadeR = do
    cidade <- (requireJsonBody :: Handler Cidade)
    cidadeId <- runDB $ insert cidade
    sendStatusJSON created201 $ object["cidadeId".= cidadeId]
    
getCidadeR :: Handler TypedContent
getCidadeR = do ----------------------[Asc CidadeNome]
    cidades <- (runDB $ selectList [] [])::Handler [Entity Cidade]
    sendStatusJSON created201 $ object["cidades".= cidades]
    
getCidadeEstadoIdR :: EstadoId -> Handler TypedContent
getCidadeEstadoIdR estadoId = do
   cidade <- (runDB $ selectList [CidadeEstadoId ==. estadoId ] []) ::Handler [Entity Cidade]
   sendStatusJSON created201 $ object["cidade".= cidade]

-- /cidade/estado/#EstadoId CidadeEstadoIdR GET

-- verificar
deleteCidadeIdR :: CidadeId -> Handler Value
deleteCidadeIdR cidadeId = do
    _ <- runDB $ get404 cidadeId
    runDB $ delete cidadeId
    sendStatusJSON noContent204 (object["resp".=("Deleted" ++ show (fromSqlKey cidadeId))])
    
putCidadeIdR :: CidadeId -> Handler Value
putCidadeIdR cidadeId = do
    _ <- runDB $ get404 cidadeId
    novoCidade <- requireJsonBody :: Handler Cidade
    runDB $ replace cidadeId novoCidade
    sendStatusJSON noContent204 (object ["resp" .= ("UPDATED " ++ show (fromSqlKey cidadeId))])

