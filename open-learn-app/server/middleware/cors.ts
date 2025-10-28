import { defineEventHandler, setResponseHeaders, isPreflightRequest } from 'h3'

export default defineEventHandler((event) => {
    const allowedOrigin = 'http://localhost:5173'

    if (isPreflightRequest(event)) {
        setResponseHeaders(event, {
            'Access-Control-Allow-Origin': allowedOrigin,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '86400',
        })
        event.res.statusCode = 204
        return ''
    } else {
        setResponseHeaders(event, {
            'Access-Control-Allow-Origin': allowedOrigin,
            'Access-Control-Allow-Credentials': 'true',
        })
    }
})