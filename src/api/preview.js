import request from '@/utils/request'
import { data } from 'jquery'
export function UploadIForma(data) {
    return request({
        url: '/api/services/app/Enclosure/UploadIFormas',
        method: 'post',
        data
    })
}

export function GetEnclosure(data) {
    return request({
        url: '/api/services/app/Enclosure/GetEnclosure',
        method: 'get',
        params: data
    })
}

export function GetOcrResult(data) {
    return request({
        url: '/api/services/app/Ocr/GetOcrResult',
        method: 'get',
        params: data
    })
}

export function GetOcrResultChange(data) {
    return request({
        url: '/api/services/app/Ocr/GetOcrResultChange',
        method: 'get',
        params: data
    })
}



export function CreateTemplate(data) {
    return request({
        url: '/api/services/app/Template/Create',
        method: 'post',
        data
    })
}

export function getDistinguishTypeEnum(data) {
    return request({
        url: '/api/services/app/EnumDictionary/GetDictionaryByName?name=DistinguishTypeEnum',
        method: 'get',
        params: data
    })
}
export function getAccessMethodEnum(data) {
    return request({
        url: '/api/services/app/EnumDictionary/GetDictionaryByName?name=AccessMethodEnum',
        method: 'get',
        params: data
    })
}
export function getCorrespondingFieldEnum(data) {
    return request({
        url: '/api/services/app/EnumDictionary/GetDictionaryByName?name=CorrespondingFieldEnum',
        method: 'get',
        params: data
    })
}





export function ExportExcel(data) {
    return request({
        url: '/api/services/app/Ocr/ExportExcel',
        method: 'post',
        data
    })
}


export function TableExportExcel(data) {
    return request({
        url: '/api/services/app/Ocr/TableExportExcel',
        method: 'post',
        data
    })
}


export function GetOrderList(data) {
    return request({
        url: '/api/services/app/Ocr/GetOrderList',
        method: 'get',
        data
    })
}




export function ConfirmImport(data) {
    return request({
        url: '/api/services/app/Ocr/ConfirmImport',
        method: 'post',
        data
    })
}






export function GetFile(data) {
    return request({
        url: '/api/services/app/Enclosure/GetFile',
        method: 'get',
        params: data
    })
}







