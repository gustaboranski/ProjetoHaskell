{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.Fornecedor where
    
import Import
import Network.HTTP.Types.Status
import Database.Persist.Postgresql

postFornecedorR :: Handler TypedContent
postFornecedorR = do
    fornecedor <- (requireJsonBody :: Handler Fornecedor)
    fornecedorId <- runDB $ insert fornecedor
    sendStatusJSON created201 $ object["fornecedorId".= fornecedorId]
