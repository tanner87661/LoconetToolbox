[
    {
        "id": "ce0d3bcc.85e348",
        "type": "tab",
        "label": "LocoNet",
        "disabled": false,
        "info": ""
    },
    {
        "id": "3aa4129b.4d654e",
        "type": "mqtt in",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "topic": "lnIn",
        "qos": "1",
        "broker": "5bc7cc44.39f4b4",
        "x": 103.01422119140625,
        "y": 191.00567626953125,
        "wires": [
            [
                "4acacac2.d33594",
                "b91c4b4a.a8c058"
            ]
        ]
    },
    {
        "id": "f92c0d91.b1319",
        "type": "ui_text",
        "z": "ce0d3bcc.85e348",
        "group": "882e979e.dec6b8",
        "order": 1,
        "width": "6",
        "height": "1",
        "name": "Newest Msg Viewer",
        "label": "Newest:",
        "format": "{{msg.payload}}",
        "layout": "row-left",
        "x": 607.7840881347656,
        "y": 190.9715633392334,
        "wires": []
    },
    {
        "id": "c693c812.2c95b8",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "Log Function",
        "func": "// initialise the counter to 0 if it doesn't exist already\nvar dashboardLog = context.get('dashboardLog')|| [];\n\ndashboardLog.unshift(msg);  //add top of list\n//dashboardLog.push(msg);  //add bottom of list\nif (dashboardLog.length > 10){\n    // Delete oldest message if > 10\n//    dashboardLog.shift(); //delete first element\n    dashboardLog.length = 10; //set length to 10\n} \n\n// store the value back\ncontext.set('dashboardLog',dashboardLog);\n\n// make it part of the outgoing msg object\nmsg = {payload : dashboardLog};\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 577.7812423706055,
        "y": 229.16186237335205,
        "wires": [
            [
                "78d1e37.d118e1c"
            ]
        ]
    },
    {
        "id": "78d1e37.d118e1c",
        "type": "ui_template",
        "z": "ce0d3bcc.85e348",
        "group": "882e979e.dec6b8",
        "name": "Viewer List",
        "order": 2,
        "width": "6",
        "height": "9",
        "format": "<ul>\n <li ng-repeat=\"x in msg.payload\">\n        {{x.payload}}\n </li>\n</ul>",
        "storeOutMessages": false,
        "fwdInMessages": false,
        "templateScope": "local",
        "x": 738.7869644165039,
        "y": 228.8891477584839,
        "wires": [
            []
        ]
    },
    {
        "id": "b1cd06fb.dda7c8",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "Plain OpCodes",
        "func": "retMsg = msg;\n//return retMsg;\nif ((msg.payload.errorFlags & ~0x10) === 0)\n{\n    var res = msg.payload.Data.length;\n    var OpCodeVal = parseInt(msg.payload.Data[0]);\n    var OpCode;\n    var paramStr = \"\";\n    for (i = 0; i < res; i++) \n    {\n        var thisElement = msg.payload.Data[i].toString(16);\n        while (thisElement.length < 2)\n            thisElement = \"0\" + thisElement;\n        paramStr = paramStr + \"0x\" + thisElement.toUpperCase();\n        if (i < res-1)\n            paramStr += \", \";\n    }\n    switch(OpCodeVal)\n    {\n        case 0x81 : OpCode = \"OPC_BUSY\"; break;\n        case 0x82 : OpCode = \"OPC_GPOFF\"; break;\n        case 0x83 : OpCode = \"OPC_GPON\"; break;\n        case 0x85 : OpCode = \"OPC_IDLE\"; break;\n        case 0xA0 : OpCode = \"OPC_LOCO_SPD\"; break;\n        case 0xA1 : OpCode = \"OPC_LOCO_DIRF\"; break;\n        case 0xA2 : OpCode = \"OPC_LOCO_SND\"; break;\n        case 0xB0 : OpCode = \"OPC_SW_REQ\"; break;\n        case 0xB1 : OpCode = \"OPC_SW_REP\"; break;\n        case 0xB2 : OpCode = \"OPC_INPUT_REP\"; break;\n        case 0xB3 : OpCode = \"OPC_UNKNOWN\"; break;\n        case 0xB4 : OpCode = \"OPC_LONG_ACK\"; break;\n        case 0xB5 : OpCode = \"OPC_SLOT_STAT1\"; break;\n        case 0xB6 : OpCode = \"OPC_CONSIST_FUNC\"; break;\n        case 0xB8 : OpCode = \"OPC_UNLINK_SLOTS\"; break;\n        case 0xB9 : OpCode = \"OPC_LINK_SLOTS\"; break;\n        case 0xBA : OpCode = \"OPC_MOVE_SLOTS\"; break;\n        case 0xBB : OpCode = \"OPC_RQ_SL_DATA\"; break;\n        case 0xBC : OpCode = \"OPC_SW_STATE\"; break;\n        case 0xBD : OpCode = \"OPC_SW_ACK\"; break;\n        case 0xBF : OpCode = \"OPC_LOCO_ADR\"; break;\n        case 0xD0 : OpCode = \"OPC_MULTI_SENSE\"; break;\n        case 0xD4 : OpCode = \"OPC_UHLI-FUN\"; break;\n        case 0xD7 : OpCode = \"OPC_PANEL_RESPONSE\"; break;\n        case 0xDF : OpCode = \"OPC_PANEL_QUERY\"; break;\n        case 0xE4 : OpCode = \"OPC_LISSY_REP\"; break;\n        case 0xE5 : OpCode = \"OPC_PEER_XFER\"; break;\n        case 0xE6 : OpCode = \"OPC_ALM_READ\"; break;\n        case 0xE7 : OpCode = \"OPC_SL_RD_DATA\"; break;\n        case 0xED : OpCode = \"OPC_IMM_PACKET\"; break;\n        case 0xEE : OpCode = \"OPC_WR_LIM_DATA\"; break;\n        case 0xEF : OpCode = \"OPC_WR_SL_DATA\"; break;\n        default: OpCode = \"Unknown OpCode \" + OpCodeVal.toString(16); break;\n    }\n    retMsg = {payload: OpCode.toString(16) + \" \" + paramStr}\n}\nelse\n    retMsg = {payload: \"Invalid Data\"}\nreturn retMsg\n",
        "outputs": 1,
        "noerr": 0,
        "x": 393.78980255126953,
        "y": 190.78975582122803,
        "wires": [
            [
                "c693c812.2c95b8",
                "f92c0d91.b1319",
                "940a6538.bef5d8"
            ]
        ]
    },
    {
        "id": "4acacac2.d33594",
        "type": "json",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "property": "payload",
        "action": "obj",
        "pretty": false,
        "x": 236.44445419311523,
        "y": 190.66666412353516,
        "wires": [
            [
                "b1cd06fb.dda7c8"
            ]
        ]
    },
    {
        "id": "78ebda17.a5eb54",
        "type": "ui_numeric",
        "z": "ce0d3bcc.85e348",
        "name": "Switch Address",
        "label": "Address",
        "group": "aabbe48e.530ab8",
        "order": 1,
        "width": 0,
        "height": 0,
        "passthru": false,
        "topic": "swAddr",
        "format": "{{value}}",
        "min": "1",
        "max": "2048",
        "step": 1,
        "x": 128.00000381469727,
        "y": 385,
        "wires": [
            [
                "4c1efee8.6a183"
            ]
        ]
    },
    {
        "id": "e9d716d9.dd4538",
        "type": "debug",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "x": 1242,
        "y": 414.99993896484375,
        "wires": []
    },
    {
        "id": "4c1efee8.6a183",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "Switch Controller Function",
        "func": "//storing incoming values for Switch Address and Bushby Bit Status\nif (msg.payload === null)\n    return null;\n    \nif (msg.topic == \"setBushby\")\n{\n    context.set(\"setBushby\", msg.payload)\n    return null\n}\nif (msg.topic == \"swAddr\")\n{\n    var newAddr = parseInt(msg.payload)-1;\n    context.set(\"swAddr\", newAddr);\n    console.log(newAddr);\n    return null\n}\n\n//in case Bushby bit data is not stored, we initialize it to CLEARED\nvar ignoreBushby = context.get(\"setBushby\")\nif (ignoreBushby === undefined) \n    ignoreBushby = false;\n\n//in case the user has not set a Switch Address, we exit without sending anything\nvar swAddr = context.get(\"swAddr\");\nif (swAddr === undefined) \n    return null;\n    \n//everything looking good, let's send the command\nvar onMsg;\nvar data= [0,0,0];\nif (ignoreBushby === false)\n    data[0] = 0xB0; //OPC_SW_REQ\nelse\n    data[0] = 0xBD; //OPC_SW_ACC to overrule Bushby\ndata[1] = swAddr & 0x7F;\ndata[2] = (swAddr & 0x0780) >>> 7;\ndata[2] = data[2] | ((msg.payload & 0x30));\n\nonMsg = {payload : {\"Sender\":\"Switch Board2\", \"MsgData\": data}}\nreturn onMsg;",
        "outputs": 1,
        "noerr": 0,
        "x": 489,
        "y": 460,
        "wires": [
            [
                "e9d716d9.dd4538",
                "d3dd0950.d293b8"
            ]
        ]
    },
    {
        "id": "84026fae.a4eb7",
        "type": "debug",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "x": 520.9952392578125,
        "y": 25,
        "wires": []
    },
    {
        "id": "9d0150de.1149",
        "type": "mqtt in",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "topic": "lnOut",
        "qos": "1",
        "broker": "5bc7cc44.39f4b4",
        "x": 103,
        "y": 25.080169677734375,
        "wires": [
            [
                "84026fae.a4eb7"
            ]
        ]
    },
    {
        "id": "7fa9c036.a16df",
        "type": "ui_dropdown",
        "z": "ce0d3bcc.85e348",
        "name": "SM ProgMode",
        "label": "",
        "place": "Select Programming Mode",
        "group": "ce90176a.b864b8",
        "order": 1,
        "width": 0,
        "height": 0,
        "passthru": true,
        "options": [
            {
                "label": "Service Mode Paged",
                "value": 32,
                "type": "num"
            },
            {
                "label": "Service Mode Direct",
                "value": 40,
                "type": "num"
            }
        ],
        "payload": "",
        "topic": "ProgMode",
        "x": 131.79258346557617,
        "y": 689.90625,
        "wires": [
            [
                "ad0156be.00d728"
            ]
        ]
    },
    {
        "id": "984c4d6b.0d0be",
        "type": "ui_numeric",
        "z": "ce0d3bcc.85e348",
        "name": "Prog Track CV #",
        "label": "CV #",
        "group": "ce90176a.b864b8",
        "order": 2,
        "width": 0,
        "height": 0,
        "passthru": true,
        "topic": "CVNr",
        "format": "{{value}}",
        "min": "1",
        "max": "1024",
        "step": 1,
        "x": 130.78121948242188,
        "y": 727.04541015625,
        "wires": [
            [
                "ad0156be.00d728"
            ]
        ]
    },
    {
        "id": "9fc28669.943568",
        "type": "ui_text",
        "z": "ce0d3bcc.85e348",
        "group": "ce90176a.b864b8",
        "order": 4,
        "width": 0,
        "height": 0,
        "name": "Service Mode Status",
        "label": "Status",
        "format": "{{msg.payload}}",
        "layout": "row-left",
        "x": 731.7925720214844,
        "y": 1028.9686279296875,
        "wires": []
    },
    {
        "id": "e7d7aaf0.fac6b8",
        "type": "ui_numeric",
        "z": "ce0d3bcc.85e348",
        "name": "Service Mode CV Value",
        "label": "CV Value",
        "group": "ce90176a.b864b8",
        "order": 3,
        "width": 0,
        "height": 0,
        "passthru": true,
        "topic": "CVVal",
        "format": "{{value}}",
        "min": 0,
        "max": "255",
        "step": 1,
        "x": 741.01416015625,
        "y": 1111.005615234375,
        "wires": [
            [
                "ad0156be.00d728"
            ]
        ]
    },
    {
        "id": "229af4cf.6db7fc",
        "type": "mqtt out",
        "z": "ce0d3bcc.85e348",
        "name": "lnIn",
        "topic": "lnIn",
        "qos": "1",
        "retain": "",
        "broker": "5bc7cc44.39f4b4",
        "x": 1248.0142211914062,
        "y": 846.1875610351562,
        "wires": []
    },
    {
        "id": "61f4ea13.fe73b4",
        "type": "mqtt in",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "topic": "lnIn",
        "qos": "1",
        "broker": "5bc7cc44.39f4b4",
        "x": 119,
        "y": 1088,
        "wires": [
            [
                "129321c.f2a00de"
            ]
        ]
    },
    {
        "id": "5a84bb77.c2e8c4",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "Response Processor",
        "func": "var dispMsgSM = null;\nvar valMsgSM = null;\nvar dispMsgOM = null;\nvar valMsgOM = null;\nif ((msg.payload.Valid == 1) && (msg.payload.From == \"LNCTC665103920\"))\n{\n    var res = msg.payload.Data.length;\n    var myNumber = parseInt(msg.payload.Data[0]);\n    switch(myNumber)\n    {\n        case 0xB4 : //LACK\n            {\n                if (context.get(\"AwaitLACK\") > 0)\n                {\n                    var newMsg;\n                    var lackResult = parseInt(msg.payload.Data[2]);\n                    switch (lackResult)\n                    {\n                        case 0x00: newMsg = {payload : \"Programmer busy\"}; break;\n                        case 0x01: newMsg = {payload : \"Working. Please wait...\"}; break;\n                        case 0x40: newMsg = {payload : \"Task completed, no E7 Reply\"}; break;\n                        case 0x7F: newMsg = {payload : \"not implemented\"}; break;\n                        default  : newMsg = {payload : \"unknown Status\"}; break; \n                    }\n                    if (context.get(\"AwaitLACK\") == 1)\n                        dispMsgSM = newMsg;\n                    else\n                        dispMsgOM = newMsg;\n                    context.set(\"AwaitLACK\", 0);\n                }\n                break;\n            }\n        case 0xE7 : //SL_RD_DATA\n            {\n                if (parseInt(msg.payload.Data[1]) == 0x0E)\n                {\n                    var valMsg;\n                    var dispMsg;\n                    var slotNr = parseInt(msg.payload.Data[2]);\n                    if (slotNr == 0x7C)\n                    {\n                        var slrdPSTAT = parseInt(msg.payload.Data[4]);\n                        var retString = \"\";\n                        if (slrdPSTAT === 0)\n                        {\n                            retString = \"Task Successfull\"\n                            var CVValue = (parseInt(msg.payload.Data[10]) & 0x7F) + ((parseInt(msg.payload.Data[8]) & 0x02) << 6);\n                            valMsg = {payload : CVValue.toString()};\n                        }\n                        else\n                        {\n                            if ((slrdPSTAT & 0x01) > 0)    \n                                retString += \"Prog Track Empty \";\n                            if ((slrdPSTAT & 0x02) > 0)    \n                                retString += \"No ACK from Decoder \";\n                            if ((slrdPSTAT & 0x04) > 0)    \n                                retString += \"No Read Compare ACK \";\n                            if ((slrdPSTAT & 0x08) > 0)    \n                                retString += \"Task Aborted by User\";\n                        }\n                        dispMsg = {payload : retString};\n                        if ((msg.payload.Data[3] & 0x04) === 0)\n                        {\n                            dispMsgSM = dispMsg;\n                            valMsgSM = valMsg;\n                        }\n                        else\n                        {\n                            dispMsgOM = dispMsg;\n                            valMsgOM = valMsg;\n                        }\n                    }\n                    context.set(\"AwaitLACK\", 0);\n                }\n                break;\n            }\n\n        case 0xEF : //SL_WR_DATA\n            {\n                if (parseInt(msg.payload.Data[1]) == 0x0E)\n                {\n                    var slotNr = parseInt(msg.payload.Data[2]);\n                    if (slotNr == 0x7C)\n                    {\n                        if ((msg.payload.Data[3] & 0x04) === 0)\n                        {\n                            context.set(\"AwaitLACK\", 1);\n                            dispMsgSM = {payload : \"Start Task \" + msg.payload.Data[3]};\n                        }\n                        else\n                        {\n                            context.set(\"AwaitLACK\", 2);\n                            dispMsgOM = {payload : \"Start Task \" + msg.payload.Data[3]};\n                        }\n                    }\n                }\n                break;\n            }\n        default: \n            {\n                context.set(\"AwaitLACK\", 0);\n                break;\n            }\n    }\n}\nreturn [dispMsgSM, dispMsgOM, valMsgSM, valMsgOM];\n",
        "outputs": 4,
        "noerr": 0,
        "x": 451,
        "y": 1089,
        "wires": [
            [
                "9fc28669.943568"
            ],
            [
                "c2216f07.c6535"
            ],
            [
                "e7d7aaf0.fac6b8"
            ],
            [
                "1c1ce3b7.6d93ec"
            ]
        ]
    },
    {
        "id": "ad0156be.00d728",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "OpCode SM Generator",
        "func": "if (msg.topic == \"ProgMode\")\n{\n    context.set(\"ProgMode\", msg.payload)\n    return null\n}\nif (msg.topic == \"CVNr\")\n{\n    context.set(\"CVNr\", msg.payload)\n    return null\n}\nif (msg.topic == \"CVVal\")\n{\n    context.set(\"CVVal\", msg.payload)\n    return null\n}\n\nfunction createJSON(fromData)\n{\n    var retStr = \"{\\\"From\\\":\\\"SM Prog\\\", \\\"Valid\\\":1, \\\"Data\\\":[\";\n    var xorCode = 0;\n    for (i = 0; i < fromData.length; i++)\n    {\n        var byteCode = parseInt(fromData[i]);\n        retStr = retStr + byteCode.toString() + \",\"\n        xorCode = xorCode ^ byteCode;\n    }\n    xorCode = xorCode ^ 0xFF;\n    retStr = retStr + xorCode.toString() + \"]}\";\n    return retStr;\n}\n\nvar data= [0xEF,0x0E,0x7C,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00];\n\n//data[3] = parseInt(flow.get(\"ProgModeSM\")) + parseInt(msg.payload);\n\nvar ProgMode = context.get(\"ProgMode\");\nif (ProgMode === undefined)\n    ProgMode = 32; //Service Mode Paged\ndata[3] = ProgMode | (msg.payload << 6);\n\nvar CVAddr = context.get(\"CVNr\");\nif (CVAddr === undefined) \n    return null;\nCVAddr = CVAddr - 1;\nvar CVValue = context.get(\"CVVal\");\nif (CVValue === undefined) \n    return null;\n//data[7] = 0x07; //Track Status can be 0\ndata[8] = ((CVValue & 0x80) >> 6) + ((CVAddr & 0x0080) >> 7) + ((CVAddr & 0x0300) >> 4);\ndata[9] = (CVAddr & 0x007F);\ndata[10] = (CVValue & 0x7F);\nmsg = {payload : createJSON(data)};\n\nreturn msg",
        "outputs": 1,
        "noerr": 0,
        "x": 953,
        "y": 741.0000610351562,
        "wires": [
            [
                "e7c53460.a25168",
                "229af4cf.6db7fc"
            ]
        ]
    },
    {
        "id": "129321c.f2a00de",
        "type": "json",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "property": "payload",
        "action": "obj",
        "pretty": false,
        "x": 260.00000381469727,
        "y": 1087.6667013168335,
        "wires": [
            [
                "5a84bb77.c2e8c4",
                "d4783063.be8f2"
            ]
        ]
    },
    {
        "id": "e7c53460.a25168",
        "type": "debug",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "x": 1269,
        "y": 802,
        "wires": []
    },
    {
        "id": "c243a74d.328de8",
        "type": "ui_dropdown",
        "z": "ce0d3bcc.85e348",
        "name": "OpsProgMode",
        "label": "",
        "place": "Select Programming Mode",
        "group": "72376ecd.b3567",
        "order": 1,
        "width": 0,
        "height": 0,
        "passthru": true,
        "options": [
            {
                "label": "Operations Mode No Feedback",
                "value": 36,
                "type": "num"
            },
            {
                "label": "Operations Mode with Feedback",
                "value": 44,
                "type": "num"
            }
        ],
        "payload": "",
        "topic": "ProgMode",
        "x": 128.00000381469727,
        "y": 863,
        "wires": [
            [
                "c2015392.7b9ad"
            ]
        ]
    },
    {
        "id": "c2216f07.c6535",
        "type": "ui_text",
        "z": "ce0d3bcc.85e348",
        "group": "72376ecd.b3567",
        "order": 5,
        "width": 0,
        "height": 0,
        "name": "Operations Mode Status",
        "label": "Status",
        "format": "{{msg.payload}}",
        "layout": "row-left",
        "x": 740.9999694824219,
        "y": 1069,
        "wires": []
    },
    {
        "id": "1c1ce3b7.6d93ec",
        "type": "ui_numeric",
        "z": "ce0d3bcc.85e348",
        "name": "Ops Mode CV Value",
        "label": "CV Value",
        "group": "72376ecd.b3567",
        "order": 4,
        "width": "0",
        "height": "0",
        "passthru": true,
        "topic": "CVVal",
        "format": "{{value}}",
        "min": 0,
        "max": "255",
        "step": 1,
        "x": 731.9999694824219,
        "y": 1151,
        "wires": [
            [
                "c2015392.7b9ad"
            ]
        ]
    },
    {
        "id": "d907b557.6b7b08",
        "type": "ui_numeric",
        "z": "ce0d3bcc.85e348",
        "name": "Main Line CV #",
        "label": "CV #",
        "group": "72376ecd.b3567",
        "order": 3,
        "width": "0",
        "height": "0",
        "passthru": true,
        "topic": "CVNr",
        "format": "{{value}}",
        "min": "1",
        "max": "1024",
        "step": 1,
        "x": 125,
        "y": 939,
        "wires": [
            [
                "c2015392.7b9ad"
            ]
        ]
    },
    {
        "id": "9d2823cf.88e1d",
        "type": "ui_numeric",
        "z": "ce0d3bcc.85e348",
        "name": "DecoderAddress",
        "label": "Decoder Address",
        "group": "72376ecd.b3567",
        "order": 2,
        "width": 0,
        "height": 0,
        "passthru": true,
        "topic": "DecAddr",
        "format": "{{value}}",
        "min": "1",
        "max": "9983",
        "step": 1,
        "x": 136,
        "y": 901,
        "wires": [
            [
                "c2015392.7b9ad"
            ]
        ]
    },
    {
        "id": "c2015392.7b9ad",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "OpCode ML Generator",
        "func": "if (msg.topic == \"ProgMode\")\n{\n    context.set(\"ProgMode\", msg.payload)\n    return null\n}\nif (msg.topic == \"CVNr\")\n{\n    context.set(\"CVNr\", msg.payload)\n    return null\n}\nif (msg.topic == \"CVVal\")\n{\n    context.set(\"CVVal\", msg.payload)\n    return null\n}\nif (msg.topic == \"DecAddr\")\n{\n    context.set(\"DecAddr\", msg.payload)\n    return null\n}\n\n\nfunction createJSON(fromData)\n{\n    var retStr = \"{\\\"From\\\":\\\"ML Prog\\\", \\\"Valid\\\":1,\\\"Data\\\":[\";\n    var xorCode = 0;\n    for (i = 0; i < fromData.length; i++)\n    {\n        var byteCode = parseInt(fromData[i]);\n        retStr = retStr + byteCode.toString() + \",\"\n        xorCode = xorCode ^ byteCode;\n    }\n    xorCode = xorCode ^ 0xFF;\n    retStr = retStr + xorCode.toString() + \"]}\";\n    return retStr;\n}\n\nvar data= [0xEF,0x0E,0x7C,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00];\n\nvar ProgMode = context.get(\"ProgMode\");\nif (ProgMode === undefined)\n    ProgMode = 36; //Ops Mode No Feedback\ndata[3] = ProgMode | (msg.payload << 6);\n\nvar CVAddr = context.get(\"CVNr\");\nif (CVAddr === undefined) \n    return null;\nCVAddr = CVAddr - 1;\nvar CVValue = context.get(\"CVVal\");\nif (CVValue === undefined) \n    return null;\nvar DecAddr = context.get(\"DecAddr\");\nif (DecAddr === undefined) \n    return null;\n\n\n//[7] = 0x07; //Track Status can be 0\ndata[5] = ((DecAddr & 0x3F80) >> 7); //HOPSA\ndata[6] = (DecAddr & 0x7F); //LOPSA\ndata[8] = ((CVValue & 0x80) >> 6) + ((CVAddr & 0x0080) >> 7) + ((CVAddr & 0x0300) >> 4);\ndata[9] = (CVAddr & 0x007F);\ndata[10] = (CVValue & 0x7F);\nmsg = {payload : createJSON(data)};\n\nreturn msg",
        "outputs": 1,
        "noerr": 0,
        "x": 1013,
        "y": 891,
        "wires": [
            [
                "229af4cf.6db7fc",
                "e7c53460.a25168"
            ]
        ]
    },
    {
        "id": "b91c4b4a.a8c058",
        "type": "debug",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "x": 518.995246887207,
        "y": 105.00568199157715,
        "wires": []
    },
    {
        "id": "c417db5a.5350e8",
        "type": "mqtt in",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "topic": "lnPing",
        "qos": "1",
        "broker": "5bc7cc44.39f4b4",
        "x": 104.00000762939453,
        "y": 141.08585357666016,
        "wires": [
            [
                "b91c4b4a.a8c058"
            ]
        ]
    },
    {
        "id": "86b76181.9b3b6",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "Add Timestamp",
        "func": "msg.payload = new Date().toString() + msg.payload;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 309.7869110107422,
        "y": 82.79261016845703,
        "wires": [
            [
                "b91c4b4a.a8c058",
                "c13b854d.d6aaa8"
            ]
        ]
    },
    {
        "id": "c13b854d.d6aaa8",
        "type": "file",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "filename": "/home/pi/Desktop/lnLog.txt",
        "appendNewline": true,
        "createDir": false,
        "overwriteFile": "false",
        "x": 568.7897415161133,
        "y": 67.60511302947998,
        "wires": []
    },
    {
        "id": "4073665d.aa1fd8",
        "type": "mqtt in",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "topic": "lnLog",
        "qos": "1",
        "broker": "5bc7cc44.39f4b4",
        "x": 103.01419448852539,
        "y": 85.00568199157715,
        "wires": [
            [
                "86b76181.9b3b6"
            ]
        ]
    },
    {
        "id": "ed497759.1e0e78",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "Reverser",
        "func": "msg.payload =!msg.payload; \nreturn msg;\n",
        "outputs": 1,
        "noerr": 0,
        "x": 799.7777290344238,
        "y": 85.00006008148193,
        "wires": [
            [
                "595fb907.11b8f8"
            ]
        ]
    },
    {
        "id": "595fb907.11b8f8",
        "type": "ui_template",
        "z": "ce0d3bcc.85e348",
        "group": "882e979e.dec6b8",
        "name": "STOP Button",
        "order": 3,
        "width": "6",
        "height": "2",
        "format": "<md-button class=\"vibrate filled touched bigfont rounded\" style=\"background-color:#FFFFFF\" ng-click=\"send({payload: msg.payload })\"> \n<svg  width=\"260px\" height=\"90px\" version=\"1.1\" viewBox=\"0 0 800 200\">\n <g id=\"Button_Long\">\n  \n  <rect fill=\"#FFFFFF\" width=\"800\" height=\"200\"/>\n  <g ng-style=\"{fill: (msg.payload || 0) ? 'lime' : 'red'}\">\n    <rect width=\"800\" height=\"200\" rx=\"80\" ry=\"80\"/>\n  </g>\n  \n  <g ng-style=\"{fill: (msg.payload || 0) ? 'lime' : 'red'}\">\n    <rect x=\"11\" y=\"10\" width=\"778\" height=\"180\" rx=\"90\" ry=\"90\"/>\n  </g>\n  <g ng-style=\"{fill: (msg.payload || 0) ? 'black' : 'white'}\">\n      \n    <text x=\"400\" y=\"125\" style=\"text-anchor:middle\"  font-weight=\"bold\" font-size=\"80\" font-family=\"Arial\">{{(msg.payload||0)? \" GO \" : \"STOP\"}} </text>\n    </g>\n  </g>\n</svg>\n</md-button>\n",
        "storeOutMessages": false,
        "fwdInMessages": false,
        "templateScope": "local",
        "x": 797.4444122314453,
        "y": 155.66672229766846,
        "wires": [
            [
                "ed497759.1e0e78",
                "5a1765fe.f5756c"
            ]
        ]
    },
    {
        "id": "88416237.872",
        "type": "debug",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "active": false,
        "console": "false",
        "complete": "false",
        "x": 1256.444351196289,
        "y": 112.77784538269043,
        "wires": []
    },
    {
        "id": "5a1765fe.f5756c",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "LN Msg Generator",
        "func": "var dataReq= [0x85]; //Idle\nif (msg.payload)\n    dataReq= [0x83]; //Go\n\nmsg = {payload : {\"Sender\":\"LNViewer\", \"MsgData\": dataReq}}\nreturn msg;\n",
        "outputs": 1,
        "noerr": 0,
        "x": 997.7776794433594,
        "y": 156.11112213134766,
        "wires": [
            [
                "88416237.872",
                "d51d04a2.b1f948"
            ]
        ]
    },
    {
        "id": "fe1cc9d5.5797a8",
        "type": "mqtt out",
        "z": "ce0d3bcc.85e348",
        "name": "lnIn",
        "topic": "lnIn",
        "qos": "1",
        "retain": "",
        "broker": "5bc7cc44.39f4b4",
        "x": 1592.888916015625,
        "y": 155.55555725097656,
        "wires": []
    },
    {
        "id": "940a6538.bef5d8",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "Layout Status",
        "func": "var str = msg.payload;\nif (str.search(\"OPC_IDLE\") >= 0)\n{\n    msg = {payload:0}\n    return msg;\n}\nif (str.search(\"OPC_GPOFF\") >= 0)\n{\n    msg = {payload:0}\n    return msg;\n}\nif (str.search(\"OPC_GPON\") >= 0)\n{\n    msg = {payload:1}\n    return msg;\n}",
        "outputs": 1,
        "noerr": 0,
        "x": 587.784065246582,
        "y": 155.7954339981079,
        "wires": [
            [
                "ed497759.1e0e78"
            ]
        ]
    },
    {
        "id": "18689da1.7a8ca2",
        "type": "ui_switch",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "label": "Bushby Bit Override",
        "group": "aabbe48e.530ab8",
        "order": 3,
        "width": 0,
        "height": 0,
        "passthru": true,
        "decouple": "false",
        "topic": "setBushby",
        "style": "",
        "onvalue": "true",
        "onvalueType": "bool",
        "onicon": "",
        "oncolor": "",
        "offvalue": "false",
        "offvalueType": "bool",
        "officon": "",
        "offcolor": "",
        "x": 149,
        "y": 428,
        "wires": [
            [
                "4c1efee8.6a183"
            ]
        ]
    },
    {
        "id": "189d580d.3e1778",
        "type": "ui_template",
        "z": "ce0d3bcc.85e348",
        "group": "aabbe48e.530ab8",
        "name": "THROWN Button",
        "order": 4,
        "width": "3",
        "height": "2",
        "format": "<md-button class=\"vibrate filled touched bigfont rounded\" style=\"background-color:#FFFFFF\" ng-mousedown=\"send({payload: buttondown()})\" ng-mouseup=\"send({payload: buttonup()})\" ng-mouseleave=\"send({payload: buttonup()})\" > \n<script>\n    var mouseDownTH = false;\n    var defValTH = 0x00;\n    var downVal = 0x10;\n    var upVal = 0x00;\n\n    this.scope.buttondown = function() {mouseDownTH = true; return (defValTH + downVal);}\n    this.scope.buttonup = function() {if (mouseDownTH) {mouseDownTH = false; return (defValTH + upVal);} else return null}\n</script>\n\n<svg  width=\"100px\" height=\"60px\" version=\"1.1\" viewBox=\"0 0 800 200\">\n <g id=\"Button_Long_TH\">\n  \n  <rect fill=\"#FFFFFF\" width=\"800\" height=\"200\"/>\n  <g ng-style=\"{fill: 'lime'}\">\n    <rect width=\"800\" height=\"200\" rx=\"80\" ry=\"80\"/>\n  </g>\n  \n  <g ng-style=\"{fill: 'lime'}\">\n    <rect x=\"11\" y=\"10\" width=\"778\" height=\"180\" rx=\"90\" ry=\"90\"/>\n  </g>\n  <g ng-style=\"{fill:'black'}\">\n      \n    <text x=\"400\" y=\"125\" style=\"text-anchor:middle\"  font-weight=\"bold\" font-size=\"80\" font-family=\"Arial\">{{\"THROWN\"}} </text>\n    </g>\n  </g>\n</svg>\n\n\n</md-button>\n",
        "storeOutMessages": false,
        "fwdInMessages": false,
        "templateScope": "local",
        "x": 140,
        "y": 478,
        "wires": [
            [
                "4c1efee8.6a183"
            ]
        ]
    },
    {
        "id": "e29ef4cc.d16658",
        "type": "ui_template",
        "z": "ce0d3bcc.85e348",
        "group": "aabbe48e.530ab8",
        "name": "CLOSED Button",
        "order": 5,
        "width": "3",
        "height": "2",
        "format": "<md-button class=\"vibrate filled touched bigfont rounded\" style=\"background-color:#FFFFFF\" ng-mousedown=\"send({payload: buttondown()})\" ng-mouseup=\"send({payload: buttonup()})\" ng-mouseleave=\"send({payload: buttonup()})\" > \n<script>\n    var mouseDownCL = false;\n    var defValCL = 0x20;\n    var downVal = 0x10;\n    var upVal = 0x00;\n\n    this.scope.buttondown = function() {mouseDownCL = true; return (defValCL + downVal);}\n    this.scope.buttonup = function() {if (mouseDownCL) {mouseDownCL = false; return (defValCL + upVal);} else return null}\n</script>\n\n<svg  width=\"100px\" height=\"60px\" version=\"1.1\" viewBox=\"0 0 800 200\">\n <g id=\"Button_Long_CL\">\n  \n  <rect fill=\"#FFFFFF\" width=\"800\" height=\"200\"/>\n  <g ng-style=\"{fill: 'red'}\">\n    <rect width=\"800\" height=\"200\" rx=\"80\" ry=\"80\"/>\n  </g>\n  \n  <g ng-style=\"{fill: 'red'}\">\n    <rect x=\"11\" y=\"10\" width=\"778\" height=\"180\" rx=\"90\" ry=\"90\"/>\n  </g>\n  <g ng-style=\"{fill:'white'}\">\n      \n    <text x=\"400\" y=\"125\" style=\"text-anchor:middle\"  font-weight=\"bold\" font-size=\"80\" font-family=\"Arial\">{{\"CLOSED\"}} </text>\n    </g>\n  </g>\n</svg>\n\n\n</md-button>\n",
        "storeOutMessages": false,
        "fwdInMessages": false,
        "templateScope": "local",
        "x": 125.0694580078125,
        "y": 524.4375610351562,
        "wires": [
            [
                "4c1efee8.6a183"
            ]
        ]
    },
    {
        "id": "549399be.152ee8",
        "type": "ui_template",
        "z": "ce0d3bcc.85e348",
        "group": "ce90176a.b864b8",
        "name": "SM Read",
        "order": 4,
        "width": "3",
        "height": "2",
        "format": "<md-button class=\"vibrate filled touched bigfont rounded\" style=\"background-color:#FFFFFF\" ng-click=\"send({payload: 0})\" > \n<svg  width=\"100px\" height=\"60px\" version=\"1.1\" viewBox=\"0 0 800 200\">\n <g id=\"Button_Long_TH\">\n  \n  <rect fill=\"#FFFFFF\" width=\"800\" height=\"200\"/>\n  <g ng-style=\"{fill: 'lime'}\">\n    <rect width=\"800\" height=\"200\" rx=\"80\" ry=\"80\"/>\n  </g>\n  \n  <g ng-style=\"{fill: 'lime'}\">\n    <rect x=\"11\" y=\"10\" width=\"778\" height=\"180\" rx=\"90\" ry=\"90\"/>\n  </g>\n  <g ng-style=\"{fill:'black'}\">\n      \n    <text x=\"400\" y=\"125\" style=\"text-anchor:middle\"  font-weight=\"bold\" font-size=\"80\" font-family=\"Arial\">{{\"READ\"}} </text>\n    </g>\n  </g>\n</svg>\n\n\n</md-button>\n",
        "storeOutMessages": false,
        "fwdInMessages": false,
        "templateScope": "local",
        "x": 109.9305419921875,
        "y": 762,
        "wires": [
            [
                "ad0156be.00d728"
            ]
        ]
    },
    {
        "id": "f8988f16.b0cbd",
        "type": "ui_template",
        "z": "ce0d3bcc.85e348",
        "group": "ce90176a.b864b8",
        "name": "SM Write",
        "order": 5,
        "width": "3",
        "height": "2",
        "format": "<md-button class=\"vibrate filled touched bigfont rounded\" style=\"background-color:#FFFFFF\" ng-click=\"send({payload: 1})\" > \n<svg  width=\"100px\" height=\"60px\" version=\"1.1\" viewBox=\"0 0 800 200\">\n <g id=\"Button_Long_CL\">\n  \n  <rect fill=\"#FFFFFF\" width=\"800\" height=\"200\"/>\n  <g ng-style=\"{fill: 'red'}\">\n    <rect width=\"800\" height=\"200\" rx=\"80\" ry=\"80\"/>\n  </g>\n  \n  <g ng-style=\"{fill: 'red'}\">\n    <rect x=\"11\" y=\"10\" width=\"778\" height=\"180\" rx=\"90\" ry=\"90\"/>\n  </g>\n  <g ng-style=\"{fill:'white'}\">\n      \n    <text x=\"400\" y=\"125\" style=\"text-anchor:middle\"  font-weight=\"bold\" font-size=\"80\" font-family=\"Arial\">{{\"WRITE\"}} </text>\n    </g>\n  </g>\n</svg>\n\n\n</md-button>\n",
        "storeOutMessages": false,
        "fwdInMessages": false,
        "templateScope": "local",
        "x": 107,
        "y": 798.4375610351562,
        "wires": [
            [
                "ad0156be.00d728"
            ]
        ]
    },
    {
        "id": "7cea6e26.7635f",
        "type": "ui_template",
        "z": "ce0d3bcc.85e348",
        "group": "72376ecd.b3567",
        "name": "ML Read",
        "order": 6,
        "width": "3",
        "height": "2",
        "format": "<md-button class=\"vibrate filled touched bigfont rounded\" style=\"background-color:#FFFFFF\" ng-click=\"send({payload: 0})\" > \n<svg  width=\"100px\" height=\"60px\" version=\"1.1\" viewBox=\"0 0 800 200\">\n <g id=\"Button_Long_TH\">\n  \n  <rect fill=\"#FFFFFF\" width=\"800\" height=\"200\"/>\n  <g ng-style=\"{fill: 'lime'}\">\n    <rect width=\"800\" height=\"200\" rx=\"80\" ry=\"80\"/>\n  </g>\n  \n  <g ng-style=\"{fill: 'lime'}\">\n    <rect x=\"11\" y=\"10\" width=\"778\" height=\"180\" rx=\"90\" ry=\"90\"/>\n  </g>\n  <g ng-style=\"{fill:'black'}\">\n      \n    <text x=\"400\" y=\"125\" style=\"text-anchor:middle\"  font-weight=\"bold\" font-size=\"80\" font-family=\"Arial\">{{\"READ\"}} </text>\n    </g>\n  </g>\n</svg>\n\n\n</md-button>\n",
        "storeOutMessages": false,
        "fwdInMessages": false,
        "templateScope": "local",
        "x": 107,
        "y": 972,
        "wires": [
            [
                "c2015392.7b9ad"
            ]
        ]
    },
    {
        "id": "e7510d7d.7594",
        "type": "ui_template",
        "z": "ce0d3bcc.85e348",
        "group": "72376ecd.b3567",
        "name": "ML Write",
        "order": 7,
        "width": "3",
        "height": "2",
        "format": "<md-button class=\"vibrate filled touched bigfont rounded\" style=\"background-color:#FFFFFF\" ng-click=\"send({payload: 1})\" > \n<svg  width=\"100px\" height=\"60px\" version=\"1.1\" viewBox=\"0 0 800 200\">\n <g id=\"Button_Long_CL\">\n  \n  <rect fill=\"#FFFFFF\" width=\"800\" height=\"200\"/>\n  <g ng-style=\"{fill: 'red'}\">\n    <rect width=\"800\" height=\"200\" rx=\"80\" ry=\"80\"/>\n  </g>\n  \n  <g ng-style=\"{fill: 'red'}\">\n    <rect x=\"11\" y=\"10\" width=\"778\" height=\"180\" rx=\"90\" ry=\"90\"/>\n  </g>\n  <g ng-style=\"{fill:'white'}\">\n      \n    <text x=\"400\" y=\"125\" style=\"text-anchor:middle\"  font-weight=\"bold\" font-size=\"80\" font-family=\"Arial\">{{\"WRITE\"}} </text>\n    </g>\n  </g>\n</svg>\n\n\n</md-button>\n",
        "storeOutMessages": false,
        "fwdInMessages": false,
        "templateScope": "local",
        "x": 104.0694580078125,
        "y": 1008.4375610351562,
        "wires": [
            [
                "c2015392.7b9ad"
            ]
        ]
    },
    {
        "id": "ff1dcf99.9fcb5",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "Request System Setup",
        "func": "function createJSON(fromData)\n{\n    var retStr = \"{\\\"From\\\":\\\"Ctrl\\\", \\\"Valid\\\":1, \\\"Data\\\":[\";\n    var xorCode = 0;\n    for (i = 0; i < fromData.length; i++)\n    {\n        var byteCode = parseInt(fromData[i]);\n        //if (byteCode < 0x10)\n        //  retStr = retStr + \"0x0\"\n        //else\n        //  retStr = retStr + \"0x\";\n        retStr = retStr + byteCode.toString() + \",\"\n        xorCode = xorCode ^ byteCode;\n    }\n    xorCode = xorCode ^ 0xFF;\n    retStr = retStr + xorCode.toString() + \"]}\";\n    return retStr;\n}\n\nif ((msg.payload == \"change\") && (msg.name == \"LocoNet Setup\"))\n{\n    var RequestSlot= [0xBB, 0x7F, 0x00];\n//    var ReadRouteALM = [0xEE, 0x10, 0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];\n    msg = {payload : createJSON(RequestSlot)};\n    return msg;\n}",
        "outputs": 1,
        "noerr": 0,
        "x": 920.8182220458984,
        "y": 1254.4546031951904,
        "wires": [
            [
                "d5bcd152.dfaae"
            ]
        ]
    },
    {
        "id": "7d282425.1c0ffc",
        "type": "debug",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "x": 1401.9092178344727,
        "y": 1395.909218788147,
        "wires": []
    },
    {
        "id": "d5bcd152.dfaae",
        "type": "mqtt out",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "topic": "lnIn",
        "qos": "1",
        "retain": "",
        "broker": "5bc7cc44.39f4b4",
        "x": 1355.8181915283203,
        "y": 1253.4545593261719,
        "wires": []
    },
    {
        "id": "46b123df.c1e84c",
        "type": "ui_ui_control",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "x": 112.81823348999023,
        "y": 1252.7274017333984,
        "wires": [
            [
                "ff1dcf99.9fcb5"
            ]
        ]
    },
    {
        "id": "8f7c42bc.22e51",
        "type": "mqtt in",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "topic": "lnIn",
        "qos": "1",
        "broker": "5bc7cc44.39f4b4",
        "x": 99.72727584838867,
        "y": 1388.0000381469727,
        "wires": [
            [
                "b3fbd0f4.4ed83"
            ]
        ]
    },
    {
        "id": "c8239100.37aac",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "Store OpSwitches",
        "func": "function createJSON(fromData)\n{\n    var retStr = \"{\\\"From\\\":\\\"OpSwCtrl\\\", \\\"Valid\\\":1, \\\"Data\\\":[\";\n    var xorCode = 0;\n    for (i = 0; i < fromData.length; i++)\n    {\n        var byteCode = parseInt(fromData[i]);\n        //if (byteCode < 0x10)\n        //  retStr = retStr + \"0x0\"\n        //else\n        //  retStr = retStr + \"0x\";\n        retStr = retStr + byteCode.toString() + \",\"\n        xorCode = xorCode ^ byteCode;\n    }\n    xorCode = xorCode ^ 0xFF;\n    retStr = retStr + xorCode.toString() + \"]}\";\n    return retStr;\n}\n\nfunction getByteNr(swNr)\n{\n    var byteNr = Math.trunc(swNr/8) + 3;\n    if (byteNr > 6)\n      byteNr++;\n    return byteNr  \n}\n\nfunction getBitMask(swNr)\n{\n    return 0x01 << ((swNr % 8)-1)\n}\n\nfunction getOpSwVal(swNr)\n{\n    var opSwData = context.get(\"DCSOpSw\");\n    if (opSwData === undefined)\n        return null\n    else\n    {\n        var bitMask = getBitMask(swNr);\n        var byteNr = getByteNr(swNr);\n        if ((opSwData[byteNr] & bitMask) > 0)\n            return 1\n        else\n            return 0;\n    }\n}\n\nfunction setOpSwVal(swNr, swVal)\n{\n    var opSwData = context.get(\"DCSOpSw\");\n    if (opSwData === undefined)\n        return null\n    else\n    {\n        var bitMask = getBitMask(swNr);\n        if (bitMask == 0x80)\n            return false;\n        var byteNr = getByteNr(swNr);\n        if (swVal > 0)\n            opSwData[byteNr] = (opSwData[byteNr] | bitMask);\n        else\n            opSwData[byteNr] = (opSwData[byteNr] & ~bitMask);\n        context.set(\"DCSOpSw\", opSwData);\n        return true;\n    }\n}\n\nif (msg.topic == \"OpSwitch\")\n{\n    for (var i=0; i<msg.payload.SwNr.length; i++)\n    {\n        setOpSwVal(msg.payload.SwNr[i], msg.payload.Status[i])\n    }\n    var opSwData = context.get(\"DCSOpSw\");\n    //send update\n    msg = {payload : createJSON(opSwData)};\n    return msg\n}\n\nif (msg.topic == \"lnIn\")\n{\n    var res = msg.payload.Data.length;\n    var myOpCode = (parseInt(msg.payload.Data[0]) << 8) + parseInt(msg.payload.Data[1]);\n    switch(myOpCode)\n    {\n        case 0xE70E : //SL_RD_DATA\n            {\n                var slotNr = parseInt(msg.payload.Data[2]);\n                if (slotNr == 0x7F)  //OpSw Bits\n                {\n                    msg.payload.Data[0] = 0xEF; //WR_SL for sending\n                    msg.payload.Data[7] = 0x07; //Track Status Byte\n                    msg.payload.Data[11] = 0x70; //Net Priority\n                    msg.payload.Data[12] = 0x7F; //for writing\n                    msg.payload.Data.splice(13,1);\n                    context.set(\"DCSOpSw\", msg.payload.Data);\n                    return null;\n                }\n                break;\n            }\n        default: \n            {\n                break;\n            }\n    }\n    return null;\n}\n",
        "outputs": 1,
        "noerr": 0,
        "x": 1109.5455932617188,
        "y": 1383.9092197418213,
        "wires": [
            [
                "7d282425.1c0ffc",
                "d5bcd152.dfaae"
            ]
        ]
    },
    {
        "id": "b3fbd0f4.4ed83",
        "type": "json",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "property": "payload",
        "action": "",
        "pretty": false,
        "x": 284.45454025268555,
        "y": 1388.0000715255737,
        "wires": [
            [
                "c8239100.37aac",
                "11fcaf47.491ed1"
            ]
        ]
    },
    {
        "id": "bf68d659.d87338",
        "type": "ui_switch",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "label": "OpSw27 - Bushby Bit",
        "group": "b81002d.aa397",
        "order": 3,
        "width": 0,
        "height": 0,
        "passthru": false,
        "decouple": "true",
        "topic": "OpSwitch",
        "style": "",
        "onvalue": "{\"SwNr\":[27],\"Status\":[1]}",
        "onvalueType": "json",
        "onicon": "",
        "oncolor": "",
        "offvalue": "{\"SwNr\":[27],\"Status\":[0]}",
        "offvalueType": "json",
        "officon": "",
        "offcolor": "",
        "x": 664.7273101806641,
        "y": 1523.1820087432861,
        "wires": [
            [
                "c8239100.37aac"
            ]
        ]
    },
    {
        "id": "c69bf51c.3d5018",
        "type": "ui_dropdown",
        "z": "ce0d3bcc.85e348",
        "name": "Speed Steps",
        "label": "Speed Step Settings",
        "place": "Select option",
        "group": "b81002d.aa397",
        "order": 1,
        "width": 0,
        "height": 0,
        "passthru": false,
        "options": [
            {
                "label": "128 Steps",
                "value": "{\"SwNr\":[21,22,23],\"Status\":[0,0,0]}",
                "type": "str"
            },
            {
                "label": "14 Steps",
                "value": "{\"SwNr\":[21,22,23],\"Status\":[0,0,1]}",
                "type": "str"
            },
            {
                "label": "28 Steps",
                "value": "{\"SwNr\":[21,22,23],\"Status\":[0,1,0]}",
                "type": "str"
            },
            {
                "label": "Motorola",
                "value": "{\"SwNr\":[21,22,23],\"Status\":[0,1,1]}",
                "type": "str"
            },
            {
                "label": "128 Step FX",
                "value": "{\"SwNr\":[21,22,23],\"Status\":[1,0,0]}",
                "type": "str"
            },
            {
                "label": "28 Step FX",
                "value": "{\"SwNr\":[21,22,23],\"Status\":[1,0,1]}",
                "type": "str"
            }
        ],
        "payload": "",
        "topic": "OpSwitch",
        "x": 635.8907623291016,
        "y": 1572.0350408554077,
        "wires": [
            [
                "4955d683.72e128"
            ]
        ]
    },
    {
        "id": "5ae7b340.bb861c",
        "type": "ui_switch",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "label": "OpSw26 - Enbale Routes",
        "group": "b81002d.aa397",
        "order": 2,
        "width": 0,
        "height": 0,
        "passthru": false,
        "decouple": "true",
        "topic": "OpSwitch",
        "style": "",
        "onvalue": "{\"SwNr\":[26],\"Status\":[1]}",
        "onvalueType": "json",
        "onicon": "",
        "oncolor": "",
        "offvalue": "{\"SwNr\":[26],\"Status\":[0]}",
        "offvalueType": "json",
        "officon": "",
        "offcolor": "",
        "x": 675.1976470947266,
        "y": 1473.292685508728,
        "wires": [
            [
                "c8239100.37aac"
            ]
        ]
    },
    {
        "id": "11fcaf47.491ed1",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "Button Updater",
        "func": "function getByteNr(swNr)\n{\n    var byteNr = Math.trunc(swNr/8) + 3;\n    if (byteNr > 6)\n      byteNr++;\n    return byteNr  \n}\n\nfunction getBitMask(swNr)\n{\n    return 0x01 << ((swNr % 8)-1)\n}\n\nfunction getOpSwVal(swNr)\n{\n    var opSwData = context.get(\"DCSOpSw\");\n    if (opSwData === undefined)\n        return null\n    else\n    {\n        var bitMask = getBitMask(swNr);\n        var byteNr = getByteNr(swNr);\n        if ((opSwData[byteNr] & bitMask) > 0)\n            return 1\n        else\n            return 0;\n    }\n}\n\nif (msg.topic == \"lnIn\")\n{\n    var res = msg.payload.Data.length;\n    var myOpCode = (parseInt(msg.payload.Data[0]) << 8) + parseInt(msg.payload.Data[1]);\n    switch(myOpCode)\n    {\n        case 0xE70E, 0xEF0E : //SL_RD_DATA, WR_SL_DATA\n            {\n                var slotNr = parseInt(msg.payload.Data[2]);\n                if (slotNr == 0x7F)  //OpSw Bits\n                {\n                    context.set(\"DCSOpSw\", msg.payload.Data);\n                    var OpSw26 = { payload:{\"SwNr\":[26],\"Status\":[getOpSwVal(26)]}}\n                    var OpSw27 = { payload:{\"SwNr\":[27],\"Status\":[getOpSwVal(27)]}}\n                    var OpSw41 = { payload:{\"SwNr\":[41],\"Status\":[getOpSwVal(41)]}}\n                    var OpSw2123 = {payload: {\"SwNr\":[21,22,23],\"Status\":[getOpSwVal(21),getOpSwVal(22),getOpSwVal(23)]}}\n                    return [OpSw26, OpSw27, OpSw2123, OpSw41];\n                }\n                break;\n            }\n        default: \n            {\n                break;\n            }\n    }\n    return null;\n}\n",
        "outputs": 4,
        "noerr": 0,
        "x": 222.43893432617188,
        "y": 1564.2224159240723,
        "wires": [
            [
                "5ae7b340.bb861c"
            ],
            [
                "bf68d659.d87338"
            ],
            [
                "6aa3e175.368c2"
            ],
            [
                "24f52b5a.155694"
            ]
        ]
    },
    {
        "id": "77c3763e.2e1b48",
        "type": "mqtt in",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "topic": "lnEcho",
        "qos": "1",
        "broker": "5bc7cc44.39f4b4",
        "x": 114,
        "y": 1138,
        "wires": [
            [
                "129321c.f2a00de"
            ]
        ]
    },
    {
        "id": "4955d683.72e128",
        "type": "json",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "property": "payload",
        "action": "",
        "pretty": false,
        "x": 834.0000228881836,
        "y": 1571.0000467300415,
        "wires": [
            [
                "c8239100.37aac"
            ]
        ]
    },
    {
        "id": "6aa3e175.368c2",
        "type": "json",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "property": "payload",
        "action": "",
        "pretty": false,
        "x": 450.0000114440918,
        "y": 1572.0000457763672,
        "wires": [
            [
                "c69bf51c.3d5018"
            ]
        ]
    },
    {
        "id": "24f52b5a.155694",
        "type": "ui_switch",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "label": "OpSw41 - Debug Beep",
        "group": "b81002d.aa397",
        "order": 4,
        "width": 0,
        "height": 0,
        "passthru": false,
        "decouple": "true",
        "topic": "OpSwitch",
        "style": "",
        "onvalue": "{\"SwNr\":[41],\"Status\":[1]}",
        "onvalueType": "json",
        "onicon": "",
        "oncolor": "",
        "offvalue": "{\"SwNr\":[41],\"Status\":[0]}",
        "offvalueType": "json",
        "officon": "",
        "offcolor": "",
        "x": 675,
        "y": 1633.3333740234375,
        "wires": [
            [
                "c8239100.37aac"
            ]
        ]
    },
    {
        "id": "20bdc8fc.040f38",
        "type": "ui_template",
        "z": "ce0d3bcc.85e348",
        "group": "b81002d.aa397",
        "name": "GP_ON Button",
        "order": 4,
        "width": "0",
        "height": "0",
        "format": "<md-button class=\"vibrate filled touched bigfont rounded\" style=\"background-color:#FFFFFF\" ng-click=\"send({payload: {&quot;From&quot;:&quot;OpSwCtrl&quot;, &quot;Valid&quot;:1, &quot;Data&quot;:[131,124]} })\"> \n<svg  width=\"260px\" height=\"90px\" version=\"1.1\" viewBox=\"0 0 800 200\">\n <g id=\"Button_Long\">\n  \n  <rect fill=\"#FFFFFF\" width=\"800\" height=\"200\"/>\n  <g ng-style=\"{fill: 'lime'}\">\n    <rect width=\"800\" height=\"200\" rx=\"80\" ry=\"80\"/>\n  </g>\n  \n  <g ng-style=\"{fill: 'lime'}\">\n    <rect x=\"11\" y=\"10\" width=\"778\" height=\"180\" rx=\"90\" ry=\"90\"/>\n  </g>\n  <g ng-style=\"{fill: 'black'}\">\n      \n    <text x=\"400\" y=\"125\" style=\"text-anchor:middle\"  font-weight=\"bold\" font-size=\"80\" font-family=\"Arial\">{{\" GO \"}} </text>\n    </g>\n  </g>\n</svg>\n</md-button>\n",
        "storeOutMessages": false,
        "fwdInMessages": false,
        "templateScope": "local",
        "x": 644.0000152587891,
        "y": 1431.3333721160889,
        "wires": [
            [
                "633060cf.5acff"
            ]
        ]
    },
    {
        "id": "633060cf.5acff",
        "type": "json",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "property": "payload",
        "action": "",
        "pretty": false,
        "x": 1075.0000267028809,
        "y": 1318.000039100647,
        "wires": [
            [
                "d5bcd152.dfaae"
            ]
        ]
    },
    {
        "id": "c5aa8a33.053448",
        "type": "ui_numeric",
        "z": "ce0d3bcc.85e348",
        "name": "Signal Head Address",
        "label": "Signal Head",
        "group": "83790385.3291",
        "order": 1,
        "width": 0,
        "height": 0,
        "passthru": false,
        "topic": "sigHead",
        "format": "{{value}}",
        "min": "1",
        "max": "2048",
        "step": 1,
        "x": 506.0000305175781,
        "y": 504.00001335144043,
        "wires": [
            [
                "b47b6c4e.bf533"
            ]
        ]
    },
    {
        "id": "b47b6c4e.bf533",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "Signal Controller Function",
        "func": "//storing incoming values for Switch Address and Bushby Bit Status\nif (msg.payload === null)\n    return null;\n\nif (msg.topic == \"sigHead\")\n{\n    var newAddr = parseInt(msg.payload)-1;\n    context.set(\"sigHead\", newAddr)\n    console.log(newAddr);\n    return null\n}\n\n//in case the user has not set a Head Address, we exit without sending anything\nvar sigHead = context.get(\"sigHead\");\nif (sigHead === undefined) \n    return null;\n\n//in case the user has not set a Signal Aspect, we exit without sending anything\n//var sigAspect = context.get(\"sigAspect\");\n//if (sigAspect === undefined) \n//    return null;\n \nvar sigAspect = msg.payload;   \n//everything looking good, let's send the command\nvar onMsg;\nvar dataReq= [0xED,0x0B,0x7F,0,0,0,0,0,0,0];\nvar boardAddr = (((sigHead-1) & 0x07FC)>>2) + 1;\nvar turnoutIndex = (sigHead-1) & 0x03;\ndataReq[3] = 0x31; //3 IM Bytes, 3 repetitions\ndataReq[5] = ((boardAddr & 0x003F)) | 0x80; //IM1\ndataReq[6] = ( (~boardAddr & 0x01C0)>>2) | ((turnoutIndex & 0x03)<<1) | 0x01; //IM2\ndataReq[7] = (sigAspect & 0x001F); //IM3\ndataReq[4] = ((dataReq[5] & 0x80)>>7) + ((dataReq[6] & 0x80)>>6) + 0x20; //DHI\ndataReq[5] &= 0x7F;\ndataReq[6] &= 0x7F;\n\nmsg = {payload : {\"Sender\":\"Switch Board\", \"MsgData\": dataReq}}\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 897.9999923706055,
        "y": 579.0000143051147,
        "wires": [
            [
                "d3dd0950.d293b8",
                "e9d716d9.dd4538"
            ]
        ]
    },
    {
        "id": "5bbb6bb8.3a6794",
        "type": "ui_template",
        "z": "ce0d3bcc.85e348",
        "group": "83790385.3291",
        "name": "Stop",
        "order": 3,
        "width": "3",
        "height": "2",
        "format": "<md-button class=\"vibrate filled touched bigfont rounded\" style=\"background-color:#FFFFFF\" ng-click=\"send({payload: 0})\" > \n<svg  width=\"100px\" height=\"60px\" version=\"1.1\" viewBox=\"0 0 800 200\">\n <g id=\"Button_Long_TH\">\n  \n  <rect fill=\"#FFFFFF\" width=\"800\" height=\"200\"/>\n  <g ng-style=\"{fill: 'red'}\">\n    <rect width=\"800\" height=\"200\" rx=\"80\" ry=\"80\"/>\n  </g>\n  \n  <g ng-style=\"{fill: 'red'}\">\n    <rect x=\"11\" y=\"10\" width=\"778\" height=\"180\" rx=\"90\" ry=\"90\"/>\n  </g>\n  <g ng-style=\"{fill:'black'}\">\n      \n    <text x=\"400\" y=\"125\" style=\"text-anchor:middle\"  font-weight=\"bold\" font-size=\"80\" font-family=\"Arial\">{{\"STOP\"}} </text>\n    </g>\n  </g>\n</svg>\n\n\n</md-button>\n",
        "storeOutMessages": false,
        "fwdInMessages": false,
        "templateScope": "local",
        "x": 508.01953125,
        "y": 556.00390625,
        "wires": [
            [
                "b47b6c4e.bf533"
            ]
        ]
    },
    {
        "id": "495cd1d9.fd0c1",
        "type": "ui_template",
        "z": "ce0d3bcc.85e348",
        "group": "83790385.3291",
        "name": "Slow",
        "order": 4,
        "width": "3",
        "height": "2",
        "format": "<md-button class=\"vibrate filled touched bigfont rounded\" style=\"background-color:#FFFFFF\" ng-click=\"send({payload: 2})\" > \n<svg  width=\"100px\" height=\"60px\" version=\"1.1\" viewBox=\"0 0 800 200\">\n <g id=\"Button_Long_CL\">\n  \n  <rect fill=\"#FFFFFF\" width=\"800\" height=\"200\"/>\n  <g ng-style=\"{fill: 'gold'}\">\n    <rect width=\"800\" height=\"200\" rx=\"80\" ry=\"80\"/>\n  </g>\n  \n  <g ng-style=\"{fill: 'gold'}\">\n    <rect x=\"11\" y=\"10\" width=\"778\" height=\"180\" rx=\"90\" ry=\"90\"/>\n  </g>\n  <g ng-style=\"{fill:'white'}\">\n      \n    <text x=\"400\" y=\"125\" style=\"text-anchor:middle\"  font-weight=\"bold\" font-size=\"80\" font-family=\"Arial\">{{\"SLOW\"}} </text>\n    </g>\n  </g>\n</svg>\n\n\n</md-button>\n",
        "storeOutMessages": false,
        "fwdInMessages": false,
        "templateScope": "local",
        "x": 505.0889892578125,
        "y": 592.4414672851562,
        "wires": [
            [
                "b47b6c4e.bf533"
            ]
        ]
    },
    {
        "id": "98208f15.f657a",
        "type": "ui_template",
        "z": "ce0d3bcc.85e348",
        "group": "83790385.3291",
        "name": "Approach",
        "order": 5,
        "width": "3",
        "height": "2",
        "format": "<md-button class=\"vibrate filled touched bigfont rounded\" style=\"background-color:#FFFFFF\" ng-click=\"send({payload: 5})\" > \n<svg  width=\"100px\" height=\"60px\" version=\"1.1\" viewBox=\"0 0 800 200\">\n <g id=\"Button_Long_TH\">\n  \n  <rect fill=\"#FFFFFF\" width=\"800\" height=\"200\"/>\n  <g ng-style=\"{fill: 'orange'}\">\n    <rect width=\"800\" height=\"200\" rx=\"80\" ry=\"80\"/>\n  </g>\n  \n  <g ng-style=\"{fill: 'orange'}\">\n    <rect x=\"11\" y=\"10\" width=\"778\" height=\"180\" rx=\"90\" ry=\"90\"/>\n  </g>\n  <g ng-style=\"{fill:'black'}\">\n      \n    <text x=\"400\" y=\"125\" style=\"text-anchor:middle\"  font-weight=\"bold\" font-size=\"80\" font-family=\"Arial\">{{\"APPROACH\"}} </text>\n    </g>\n  </g>\n</svg>\n\n\n</md-button>\n",
        "storeOutMessages": false,
        "fwdInMessages": false,
        "templateScope": "local",
        "x": 517.01953125,
        "y": 631.00390625,
        "wires": [
            [
                "b47b6c4e.bf533"
            ]
        ]
    },
    {
        "id": "a74ffaec.c04978",
        "type": "ui_template",
        "z": "ce0d3bcc.85e348",
        "group": "83790385.3291",
        "name": "Clear",
        "order": 6,
        "width": "3",
        "height": "2",
        "format": "<md-button class=\"vibrate filled touched bigfont rounded\" style=\"background-color:#FFFFFF\" ng-click=\"send({payload: 10})\" > \n<svg  width=\"100px\" height=\"60px\" version=\"1.1\" viewBox=\"0 0 800 200\">\n <g id=\"Button_Long_CL\">\n  \n  <rect fill=\"#FFFFFF\" width=\"800\" height=\"200\"/>\n  <g ng-style=\"{fill: 'green'}\">\n    <rect width=\"800\" height=\"200\" rx=\"80\" ry=\"80\"/>\n  </g>\n  \n  <g ng-style=\"{fill: 'green'}\">\n    <rect x=\"11\" y=\"10\" width=\"778\" height=\"180\" rx=\"90\" ry=\"90\"/>\n  </g>\n  <g ng-style=\"{fill:'white'}\">\n      \n    <text x=\"400\" y=\"125\" style=\"text-anchor:middle\"  font-weight=\"bold\" font-size=\"80\" font-family=\"Arial\">{{\"CLEAR\"}} </text>\n    </g>\n  </g>\n</svg>\n\n\n</md-button>\n",
        "storeOutMessages": false,
        "fwdInMessages": false,
        "templateScope": "local",
        "x": 504.0889892578125,
        "y": 667.4414672851562,
        "wires": [
            [
                "b47b6c4e.bf533"
            ]
        ]
    },
    {
        "id": "8d50618c.e695e",
        "type": "inject",
        "z": "ce0d3bcc.85e348",
        "name": "Init SigHead Addr",
        "topic": "sigHead",
        "payload": "800",
        "payloadType": "num",
        "repeat": "",
        "crontab": "",
        "once": true,
        "onceDelay": "",
        "x": 185.01952362060547,
        "y": 566.5039138793945,
        "wires": [
            [
                "c5aa8a33.053448"
            ]
        ]
    },
    {
        "id": "46603d95.2755e4",
        "type": "inject",
        "z": "ce0d3bcc.85e348",
        "name": "NewAspect",
        "topic": "NewAspect",
        "payload": "true",
        "payloadType": "bool",
        "repeat": "",
        "crontab": "",
        "once": true,
        "onceDelay": "",
        "x": 285.01953125,
        "y": 621.5039129257202,
        "wires": [
            [
                "18968e5a.0290e2"
            ]
        ]
    },
    {
        "id": "18968e5a.0290e2",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "Signal Timer Controller Function",
        "func": "//storing incoming values for Switch Address and Bushby Bit Status\n\nif (msg.payload === null)\n    return msg;\n\n\nif (msg.topic == \"NewAspect\")\n{\n    var thisAspect = context.get(\"newAspect\");\n    if (thisAspect === undefined)\n        thisAspect = 0;\n    thisAspect = Math.floor(Math.random() * 4);\n    switch (thisAspect)\n    {\n        case 1: thisAspect = 2; break;\n        case 2: thisAspect = 5; break;\n        case 3: thisAspect = 10; break;\n    }\n    context.set(\"newAspect\", thisAspect);\n    var newAddr = Math.floor(Math.random() * 12) + 799;\n    context.set(\"sigHead\", newAddr)\n    msg.payload = thisAspect;\n}\n\nif (msg.topic == \"sigHead\")\n{\n    var newAddr = parseInt(msg.payload)-1;\n    context.set(\"sigHead\", newAddr)\n    return null\n}\n\n//in case the user has not set a Head Address, we exit without sending anything\nvar sigHead = context.get(\"sigHead\");\nif (sigHead === undefined) \n    return null;\n\nvar sigAspect = msg.payload;   \n//everything looking good, let's send the command\nvar onMsg;\nvar data= [0xED,0x0B,0x7F,0,0,0,0,0,0,0];\nvar boardAddr = (((sigHead-1) & 0x07FC)>>2) + 1;\nvar turnoutIndex = (sigHead-1) & 0x03;\ndata[3] = 0x31; //3 IM Bytes, 3 repetitions\ndata[5] = ((boardAddr & 0x003F)) | 0x80; //IM1\ndata[6] = ( (~boardAddr & 0x01C0)>>2) | ((turnoutIndex & 0x03)<<1) | 0x01; //IM2\ndata[7] = (sigAspect & 0x01FF); //IM3\ndata[4] = ((data[5] & 0x80)>>7) + ((data[6] & 0x80)>>6) + 0x20; //DHI\ndata[5] &= 0x7F;\ndata[6] &= 0x7F;\n\nonMsg = {payload : {\"Sender\":\"Switch Board\", \"MsgData\": data}}\nreturn onMsg;",
        "outputs": 1,
        "noerr": 0,
        "x": 807.0195732116699,
        "y": 667.5038976669312,
        "wires": [
            [
                "e9d716d9.dd4538",
                "d3dd0950.d293b8"
            ]
        ]
    },
    {
        "id": "d4783063.be8f2",
        "type": "debug",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "x": 463.890625,
        "y": 1204.65234375,
        "wires": []
    },
    {
        "id": "ab2f9f1e.b55f3",
        "type": "debug",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "x": 985,
        "y": 1725,
        "wires": []
    },
    {
        "id": "9b514036.5a9ce",
        "type": "inject",
        "z": "ce0d3bcc.85e348",
        "name": "Brightnesstrigger",
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "repeat": "3",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "x": 138,
        "y": 1726,
        "wires": [
            [
                "2205ddc5.697e92"
            ]
        ]
    },
    {
        "id": "2205ddc5.697e92",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "SendBrightness",
        "func": "function createJSON(fromData)\n{\n    var retStr = \"{\\\"From\\\":\\\"LightSensor\\\", \\\"Valid\\\":1,\\\"Data\\\":[\";\n    var xorCode = 0;\n    for (i = 0; i < fromData.length; i++)\n    {\n        var byteCode = parseInt(fromData[i]);\n        retStr = retStr + byteCode.toString() + \",\"\n        xorCode = xorCode ^ byteCode;\n    }\n    xorCode = xorCode ^ 0xFF;\n    retStr = retStr + xorCode.toString() + \"]}\";\n    return retStr;\n}\n\nvar data= [0xE5,0x10,0x0C,0x71,0x02,0x10,0x00,0x01,0x00,0x1F,0x10,0x00,0x00, 0x00, 0x00];\n\nvar brightness = global.get(\"LightRamp\");\nif (isNaN(brightness))\n    brightness = 0;\nbrightness = (brightness + 1) % 511;\nglobal.set(\"LightRamp\", brightness);\nbrightness = Math.abs(brightness - 255);\n\ndata[11] = brightness & 0x7F;\ndata[10] |= ((brightness & 0x80)>>7);\n//msg = {payload: brightness};\nmsg = {payload : createJSON(data)};\n\nreturn msg",
        "outputs": 1,
        "noerr": 0,
        "x": 367,
        "y": 1725,
        "wires": [
            [
                "ab2f9f1e.b55f3"
            ]
        ]
    },
    {
        "id": "e89f265c.c02c98",
        "type": "ui_slider",
        "z": "ce0d3bcc.85e348",
        "name": "SignalBrightness",
        "label": "Signal Brightness",
        "group": "5fa366d.7609b98",
        "order": 1,
        "width": 0,
        "height": 0,
        "passthru": true,
        "topic": "sigBrightness",
        "min": 0,
        "max": "4095",
        "step": 1,
        "x": 140,
        "y": 1781,
        "wires": [
            [
                "7cd4fc4d.ed8c84"
            ]
        ]
    },
    {
        "id": "bba89420.2175c8",
        "type": "ui_slider",
        "z": "ce0d3bcc.85e348",
        "name": "CTCBrightness",
        "label": "CTC Brightness",
        "group": "5fa366d.7609b98",
        "order": 2,
        "width": 0,
        "height": 0,
        "passthru": true,
        "topic": "ctcBrightness",
        "min": 0,
        "max": "4095",
        "step": 1,
        "x": 129,
        "y": 1825,
        "wires": [
            [
                "7cd4fc4d.ed8c84"
            ]
        ]
    },
    {
        "id": "ef146a7b.d9cf48",
        "type": "ui_slider",
        "z": "ce0d3bcc.85e348",
        "name": "AnalogValue",
        "label": "Analog Input",
        "group": "5fa366d.7609b98",
        "order": 4,
        "width": 0,
        "height": 0,
        "passthru": true,
        "topic": "genAnalog",
        "min": 0,
        "max": "4095",
        "step": 1,
        "x": 117,
        "y": 1872,
        "wires": [
            [
                "7cd4fc4d.ed8c84"
            ]
        ]
    },
    {
        "id": "c29ae820.dd80b8",
        "type": "ui_numeric",
        "z": "ce0d3bcc.85e348",
        "name": "AnalogChannel",
        "label": "Input #",
        "group": "5fa366d.7609b98",
        "order": 3,
        "width": 0,
        "height": 0,
        "passthru": true,
        "topic": "analogChannel",
        "format": "{{value}}",
        "min": 0,
        "max": "16383",
        "step": 1,
        "x": 123,
        "y": 1917,
        "wires": [
            [
                "7cd4fc4d.ed8c84"
            ]
        ]
    },
    {
        "id": "7cd4fc4d.ed8c84",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "SendAnalog",
        "func": "if (msg.topic == \"analogChannel\")\n{\n    global.set(\"analogAddr\", msg.payload);\n    return null;\n}\n\nvar analogAddr = 0;\nif (msg.topic == \"genAnalog\")\n    analogAddr = global.get(\"analogAddr\");\nif (msg.topic == \"sigBrightness\")\n    analogAddr = 16;\nif (msg.topic == \"ctcBrightness\")\n    analogAddr = 15;\n\nif (isNaN(analogAddr)) return; //invalid address\n\nfunction createJSON(fromData)\n{\n    var retStr = \"{\\\"From\\\":\\\"AnalogControl\\\", \\\"Valid\\\":1,\\\"Data\\\":[\";\n    var xorCode = 0;\n    for (i = 0; i < fromData.length; i++)\n    {\n        var byteCode = parseInt(fromData[i]);\n        retStr = retStr + byteCode.toString() + \",\"\n        xorCode = xorCode ^ byteCode;\n    }\n    xorCode = xorCode ^ 0xFF;\n    retStr = retStr + xorCode.toString() + \"]}\";\n    return retStr;\n}\n\nvar data= [0xE5,0x10,0x0C,0x71,0x02,0x00,0x00,0x00,0x00,0x1F,0x10,0x00,0x00, 0x00, 0x00];\n\nvar analogVal = msg.payload;\ndata[8] = analogAddr & 0x3F;\ndata[9] = (analogAddr>>6) & 0x3F;\ndata[12] = analogVal & 0x3F;\ndata[13] |= (analogVal>>6) & 0x3F;\nmsg = {payload : createJSON(data)};\n\nreturn msg",
        "outputs": 1,
        "noerr": 0,
        "x": 516,
        "y": 1835,
        "wires": [
            [
                "46bb6943.835088",
                "8fe71936.85eb88"
            ]
        ]
    },
    {
        "id": "8fe71936.85eb88",
        "type": "mqtt out",
        "z": "ce0d3bcc.85e348",
        "name": "lnIn",
        "topic": "lnIn",
        "qos": "1",
        "retain": "",
        "broker": "5bc7cc44.39f4b4",
        "x": 963,
        "y": 1835,
        "wires": []
    },
    {
        "id": "46bb6943.835088",
        "type": "debug",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "x": 979,
        "y": 1780,
        "wires": []
    },
    {
        "id": "d51d04a2.b1f948",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "Create IoTT LNGW Format",
        "func": "//expected format: {Sender:\"SenderName\", MsgData:[x,x,x...x]}\n//XOR byte may or may not be included\nvar thisSender = msg.payload.Sender;\nif (thisSender === undefined)\n    thisSender = \"LNMSGGEN\";\n\nvar hasReplay = false;\nvar msgLength = 0;\nvar thisReqID = \"\";\n\nif (msg.payload.MsgData !== undefined)\n{\n    hasReply = (msg.payload.MsgData[0] & 0x08) > 0;\n    switch ((msg.payload.MsgData[0] & 0x60)>>5)\n    {\n        case 0 : msgLength = 2; break;\n        case 1 : msgLength = 4; break;\n        case 2 : msgLength = 6; break;\n        case 3 : msgLength = msg.payload.MsgData[1]; break;\n    }\n\n    if (msg.payload.MsgData.length < (msgLength - 1))\n        return null; //message has not sufficient # of bytes, nothing to send\n        \n    if (hasReply)\n    {\n        thisReqID = \"\\\"ReqID\\\":\" + Math.round(0x3FFF * Math.random()).toString() + \",\";\n        context.set(\"ReqID\", thisReqID);\n    }\n\n    var retStr = \"{\\\"From\\\":\\\"\" + thisSender + \"\\\", \\\"Valid\\\":1, \" + thisReqID + \"\\\"Data\\\":[\";\n    var xorCode = 0;\n    for (i = 0; i < msgLength-1; i++)\n    {\n        var byteCode = msg.payload.MsgData[i];\n        retStr = retStr + byteCode.toString() + \",\"\n        xorCode = xorCode ^ byteCode;\n    }\n    xorCode = xorCode ^ 0xFF;\n    retStr = retStr + xorCode.toString() + \"]}\";\n\n    var outMsg= {payload : retStr};\n\n    return outMsg;\n}\nelse\n    return null;\n",
        "outputs": 1,
        "noerr": 0,
        "x": 1329,
        "y": 156,
        "wires": [
            [
                "fe1cc9d5.5797a8"
            ]
        ]
    },
    {
        "id": "d3dd0950.d293b8",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "Create IoTT LNGW Format",
        "func": "//expected format: {Sender:\"SenderName\", MsgData:[x,x,x...x]}\n//XOR byte may or may not be included\nvar thisSender = msg.payload.Sender;\nif (thisSender === undefined)\n    thisSender = \"LNMSGGEN\";\n\nvar hasReplay = false;\nvar msgLength = 0;\nvar thisReqID = \"\";\n\nif (msg.payload.MsgData !== undefined)\n{\n    hasReply = (msg.payload.MsgData[0] & 0x08) > 0;\n    switch ((msg.payload.MsgData[0] & 0x60)>>5)\n    {\n        case 0 : msgLength = 2; break;\n        case 1 : msgLength = 4; break;\n        case 2 : msgLength = 6; break;\n        case 3 : msgLength = msg.payload.MsgData[1]; break;\n    }\n\n    if (msg.payload.MsgData.length < (msgLength - 1))\n        return null; //message has not sufficient # of bytes, nothing to send\n        \n    if (hasReply)\n    {\n        thisReqID = \"\\\"ReqID\\\":\" + Math.round(0x3FFF * Math.random()).toString() + \",\";\n        context.set(\"ReqID\", thisReqID);\n    }\n\n    var retStr = \"{\\\"From\\\":\\\"\" + thisSender + \"\\\", \\\"Valid\\\":1, \" + thisReqID + \"\\\"Data\\\":[\";\n    var xorCode = 0;\n    for (i = 0; i < msgLength-1; i++)\n    {\n        var byteCode = msg.payload.MsgData[i];\n        retStr = retStr + byteCode.toString() + \",\"\n        xorCode = xorCode ^ byteCode;\n    }\n    xorCode = xorCode ^ 0xFF;\n    retStr = retStr + xorCode.toString() + \"]}\";\n\n    var outMsg= {payload : retStr};\n\n    return outMsg;\n}\nelse\n    return null;\n",
        "outputs": 1,
        "noerr": 0,
        "x": 1287,
        "y": 541,
        "wires": [
            [
                "ec288c53.e1614"
            ]
        ]
    },
    {
        "id": "ec288c53.e1614",
        "type": "mqtt out",
        "z": "ce0d3bcc.85e348",
        "name": "lnIn",
        "topic": "lnIn",
        "qos": "1",
        "retain": "",
        "broker": "5bc7cc44.39f4b4",
        "x": 1598.888916015625,
        "y": 482.55555725097656,
        "wires": []
    },
    {
        "id": "412e438f.49a1ec",
        "type": "mqtt in",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "topic": "lnIn2",
        "qos": "1",
        "broker": "5bc7cc44.39f4b4",
        "x": 105,
        "y": 280,
        "wires": [
            [
                "a4d3f87d.7df8c8"
            ]
        ]
    },
    {
        "id": "a4d3f87d.7df8c8",
        "type": "debug",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "x": 280,
        "y": 280,
        "wires": []
    },
    {
        "id": "3036ad1b.143722",
        "type": "mqtt in",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "topic": "lnIn2",
        "qos": "1",
        "broker": "5bc7cc44.39f4b4",
        "x": 113,
        "y": 2694,
        "wires": [
            [
                "32777d5.0e6bf82"
            ]
        ]
    },
    {
        "id": "c07ea5a1.78c968",
        "type": "mqtt in",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "topic": "lnIn",
        "qos": "1",
        "broker": "5bc7cc44.39f4b4",
        "x": 110,
        "y": 2744,
        "wires": [
            [
                "32777d5.0e6bf82"
            ]
        ]
    },
    {
        "id": "3b29aaee.2111f6",
        "type": "mqtt out",
        "z": "ce0d3bcc.85e348",
        "name": "lnIn",
        "topic": "lnIn",
        "qos": "1",
        "retain": "",
        "broker": "5bc7cc44.39f4b4",
        "x": 1277,
        "y": 2683,
        "wires": []
    },
    {
        "id": "fc6fe110.2230d",
        "type": "mqtt out",
        "z": "ce0d3bcc.85e348",
        "name": "lnIn2",
        "topic": "lnIn2",
        "qos": "1",
        "retain": "",
        "broker": "5bc7cc44.39f4b4",
        "x": 1277,
        "y": 2741,
        "wires": []
    },
    {
        "id": "32777d5.0e6bf82",
        "type": "json",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "property": "payload",
        "action": "obj",
        "pretty": false,
        "x": 302,
        "y": 2721,
        "wires": [
            [
                "525ad91d.da4368"
            ]
        ]
    },
    {
        "id": "63df25d6.24ab9c",
        "type": "json",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "property": "payload",
        "action": "obj",
        "pretty": false,
        "x": 1090,
        "y": 2683,
        "wires": [
            [
                "3b29aaee.2111f6"
            ]
        ]
    },
    {
        "id": "c9679353.767ad",
        "type": "json",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "property": "payload",
        "action": "obj",
        "pretty": false,
        "x": 1090,
        "y": 2741,
        "wires": [
            [
                "fc6fe110.2230d"
            ]
        ]
    },
    {
        "id": "525ad91d.da4368",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "Router",
        "func": "var thisRouter = 1;\nif (Array.isArray(msg.payload.Rx))\n{\n    if (msg.payload.Rx.indexOf(thisRouter) >= 0)\n        return; //already seen\n    msg.payload.Rx.push(thisRouter);\n}\nelse\n    msg.payload.Rx = [thisRouter];\n\nif ((msg.payload.Valid == 1))\n{   \n    if (msg.payload.ReqID === 0)\n        msg.payload.ReqID = Math.floor(Math.random() * 1024);\n    if (msg.topic == \"lnIn2\")\n        return [msg, null];\n    if (msg.topic == \"lnIn\")\n        return [null, msg];\n}",
        "outputs": 2,
        "noerr": 0,
        "x": 483,
        "y": 2721,
        "wires": [
            [
                "63df25d6.24ab9c"
            ],
            [
                "30c60314.dccbcc"
            ]
        ]
    },
    {
        "id": "41bcc14d.6916c",
        "type": "debug",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "x": 1088,
        "y": 2826,
        "wires": []
    },
    {
        "id": "6cd0ab17.3dccb4",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "Switch Enabler",
        "func": "function shiftSwiAddr(lnData, shiftBy)\n{\n    var swiAddr = (lnData[1] & 0x7F) + ((lnData[2] & 0x0F)<<7);\n    if (((swiAddr + shiftBy) >= 0) && ((swiAddr + shiftBy) < 2048))\n    {\n        swiAddr += shiftBy;\n        lnData[1] = swiAddr &= 0x7F;\n        lnData[2] &= 0x70;\n        lnData[2] |= (swiAddr >> 7) & 0x0F;\n        lnData[3] = lnData[0] ^lnData[1] ^ lnData[2] ^ 0xFF;\n        return lnData;\n    }\n    else\n        return lnData;\n}\n\nif ([0xB0, 0xBD, 0xBC].indexOf(msg.payload.Data[0]) < 0)\n    return msg;\nelse\n{\n    var swiAddr = (msg.payload.Data[1] & 0x7F) + ((msg.payload.Data[2] & 0x0F)<<7) + 1;\n    if (([201,202,203,204].indexOf(swiAddr) >= 0) || (msg.payload.Data[0] == 0xBC))\n    {\n        msg.payload.Data = shiftSwiAddr(msg.payload.Data, -200)\n        return msg;\n    }\n}",
        "outputs": 1,
        "noerr": 0,
        "x": 508,
        "y": 3530,
        "wires": [
            []
        ]
    },
    {
        "id": "30c60314.dccbcc",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "XOR Check",
        "func": "    var hasReply = (msg.payload.Data[0] & 0x08) > 0;\n    var msgLength = 0;\n    switch ((msg.payload.Data[0] & 0x60)>>5)\n    {\n        case 0 : msgLength = 2; break;\n        case 1 : msgLength = 4; break;\n        case 2 : msgLength = 6; break;\n        case 3 : msgLength = msg.payload.Data[1]; break;\n    }\n\n    var xorCode = 0;\n    for (i = 0; i < msgLength; i++)\n    {\n        xorCode = xorCode ^ msg.payload.Data[i];\n    }\n    if (xorCode == 0xFF)\n        return [msg, null];\n    else\n    {\n        msg.payload.calclen = msgLength;\n        msg.payload.xor = xorCode;\n        return [null, msg];\n    }\n",
        "outputs": 2,
        "noerr": 0,
        "x": 821,
        "y": 2739,
        "wires": [
            [
                "c9679353.767ad"
            ],
            [
                "41bcc14d.6916c"
            ]
        ]
    },
    {
        "id": "9c85052a.8071e8",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "Switch Disabler",
        "func": "if ([0xB0].indexOf(msg.payload.Data[0]) < 0)\n    return msg; //other message, send it out\nelse\n    return; //B0 SwiReq is found, so return empty\n",
        "outputs": 1,
        "noerr": 0,
        "x": 505,
        "y": 3637,
        "wires": [
            []
        ]
    },
    {
        "id": "2015d3d2.dbd45c",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "Switch Addr Shifter",
        "func": "function shiftSwiAddr(lnData, shiftBy)\n{\n    var swiAddr = (lnData[1] & 0x7F) + ((lnData[2] & 0x0F)<<7);\n    if (((swiAddr + shiftBy) >= 0) && ((swiAddr + shiftBy) < 2048)) //validity check\n    {\n        swiAddr += shiftBy;\n        lnData[1] = swiAddr & 0x7F; //low 7 bits of Addr\n        lnData[2] &= 0x70; //keep position and coil status\n        lnData[2] |= (swiAddr >> 7) & 0x0F; //hi 4 bits of Addr\n        lnData[3] = lnData[0] ^lnData[1] ^ lnData[2] ^ 0xFF; //XOR check code\n        return lnData;\n    }\n    else\n        return lnData; //invalid data, process original message\n}\n\nif ([0xB0, 0xBD, 0xBC].indexOf(msg.payload.Data[0]) < 0)\n    return msg; //all other messages routed to command station\nelse\n{\n    var swiAddr = (msg.payload.Data[1] & 0x7F) + ((msg.payload.Data[2] & 0x0F)<<7) + 1;\n    if (([1,2,3,4].indexOf(swiAddr) >= 0) || (msg.payload.Data[0] == 0xBC))\n    {\n        msg.payload.Data = shiftSwiAddr(msg.payload.Data, 10)\n        return msg;\n    }\n}",
        "outputs": 1,
        "noerr": 0,
        "x": 735,
        "y": 3587,
        "wires": [
            []
        ]
    },
    {
        "id": "81384405.9ef7f8",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "Switch 1-4 Filter",
        "func": "if ([0xB0].indexOf(msg.payload.Data[0]) < 0)\n        return msg; //other message, send it out\nelse\n{\n    var swiAddr = (msg.payload.Data[1] & 0x7F) + ((msg.payload.Data[2] & 0x0F)<<7) + 1;\n    if ([1,2,3,4].indexOf(swiAddr) >= 0)\n        return msg; //other message, send it out\n    else\n        return; //B0 SwiReq is found, so return empty\n}",
        "outputs": 1,
        "noerr": 0,
        "x": 506,
        "y": 3586,
        "wires": [
            []
        ]
    },
    {
        "id": "ccf886b2.f61358",
        "type": "ui_button",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "group": "f0426ca0.d99b6",
        "order": 1,
        "width": 0,
        "height": 0,
        "passthru": false,
        "label": "Find SV Devices",
        "color": "",
        "bgcolor": "",
        "icon": "",
        "payload": "",
        "payloadType": "str",
        "topic": "",
        "x": 137,
        "y": 2023,
        "wires": [
            [
                "476d639e.37ed1c"
            ]
        ]
    },
    {
        "id": "476d639e.37ed1c",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "RequestID",
        "func": "function createJSON(fromData)\n{\n    var retStr = \"{\\\"From\\\":\\\"SVControl\\\", \\\"Valid\\\":1,\\\"Data\\\":[\";\n    var xorCode = 0;\n    for (i = 0; i < fromData.length; i++)\n    {\n        var byteCode = parseInt(fromData[i]);\n        retStr = retStr + byteCode.toString() + \",\"\n        xorCode = xorCode ^ byteCode;\n    }\n    xorCode = xorCode ^ 0xFF;\n    retStr = retStr + xorCode.toString() + \"]}\";\n    return retStr;\n}\n\nSVList = [];\nflow.set(\"SVList\", SVList); //clear list\nflow.set(\"SVSel\", -1);\nvar data= [0xE5,0x10,0x0C,0x07,0x02,0x10,0x00,0x00,0x00,0x00,0x10,0x00,0x00, 0x00, 0x00];\nmsg1 = {payload : createJSON(data)};\nmsg2 = {payload:-1,options:[]}\nreturn [msg1, msg2];",
        "outputs": 2,
        "noerr": 0,
        "x": 513,
        "y": 2021,
        "wires": [
            [
                "240e3f29.d3c3c",
                "8fe71936.85eb88"
            ],
            [
                "a74af5c2.cf95d8"
            ]
        ]
    },
    {
        "id": "240e3f29.d3c3c",
        "type": "debug",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "x": 761,
        "y": 2017,
        "wires": []
    },
    {
        "id": "8873742c.757f38",
        "type": "mqtt in",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "topic": "lnIn",
        "qos": "1",
        "broker": "5bc7cc44.39f4b4",
        "x": 97,
        "y": 2101,
        "wires": [
            [
                "39a1d4eb.1f221c"
            ]
        ]
    },
    {
        "id": "39a1d4eb.1f221c",
        "type": "json",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "property": "payload",
        "action": "",
        "pretty": false,
        "x": 281.7272644042969,
        "y": 2101.000033378601,
        "wires": [
            [
                "c097254a.fc2218"
            ]
        ]
    },
    {
        "id": "c097254a.fc2218",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "SV Processor",
        "func": "if (msg.topic == \"lnIn\")\n{\n    var res = msg.payload.Data.length;\n    var myOpCode = (parseInt(msg.payload.Data[0]) << 8) + parseInt(msg.payload.Data[1]);\n    var zeroMsg = {payload:0};\n    switch(myOpCode)\n    {\n        case 0xE510 : //OPC_PEER\n            {\n                var SVList = flow.get(\"SVList\");\n                if (SVList === undefined)\n                    SVList = [];\n                var SVSel = flow.get(\"SVSel\");\n                if (SVSel === undefined)\n                    SVSel = -1;\n                var lnAddr = (parseInt(msg.payload.Data[7]) << 8) + parseInt(msg.payload.Data[6]) + ((parseInt(msg.payload.Data[5]) & 0x01)<<7);\n                if (parseInt(msg.payload.Data[4]) == 0x02) //SV Format 2\n                {\n                    var D0, D1, D2, D3 = 0;\n                    var memPos;\n                    switch (parseInt(msg.payload.Data[3]))\n                        {\n                            case 0x41:;\n                            case 0x42:\n                            {\n                                if (lnAddr == SVList[SVSel].lnAddr)\n                                {\n                                    var memPos = parseInt(msg.payload.Data[8]) | ((parseInt(msg.payload.Data[5]) & 0x04) << 5);\n                                    memPos |= (parseInt(msg.payload.Data[9])<<8) | ((parseInt(msg.payload.Data[5]) & 0x08) << 12);\n                                    D0 = parseInt(msg.payload.Data[11]) | ((parseInt(msg.payload.Data[10]) & 0x01) << 7);\n                                    var memPosMsg = {payload:memPos};\n                                    var lenMsg = {payload:0};\n                                    var D0Msg = {payload:D0};\n                                    return [null, memPosMsg, lenMsg, D0Msg, zeroMsg, zeroMsg, zeroMsg];\n                                }\n                                break;\n                            }\n                            case 0x45:;\n                            case 0x46:\n                            {\n                                if (lnAddr == SVList[SVSel].lnAddr)\n                                {\n                                    var memPos = parseInt(msg.payload.Data[8]) | ((parseInt(msg.payload.Data[5]) & 0x04) << 5);\n                                    memPos |= (parseInt(msg.payload.Data[9])<<8) | ((parseInt(msg.payload.Data[5]) & 0x08) << 12);\n                                    D0 = parseInt(msg.payload.Data[11]) | ((parseInt(msg.payload.Data[10]) & 0x01) << 7);\n                                    D1 = parseInt(msg.payload.Data[12]) | ((parseInt(msg.payload.Data[10]) & 0x02) << 6);\n                                    D2 = parseInt(msg.payload.Data[13]) | ((parseInt(msg.payload.Data[10]) & 0x04) << 5);\n                                    D3 = parseInt(msg.payload.Data[14]) | ((parseInt(msg.payload.Data[10]) & 0x08) << 4);\n                                    var memPosMsg = {payload:memPos};\n                                    var lenMsg = {payload:1};\n                                    var D0Msg = {payload:D0};\n                                    var D1Msg = {payload:D1};\n                                    var D2Msg = {payload:D2};\n                                    var D3Msg = {payload:D3};\n                                    return [null, memPosMsg, lenMsg, D0Msg, D1Msg, D2Msg, D3Msg];\n                                }\n                                break;\n                            }\n                            case 0x47: //Discover Req Resp\n                            {\n                                var currentDev = {};\n                                currentDev.lnAddr = lnAddr;\n                                currentDev.manufID = parseInt(msg.payload.Data[12]);\n                                currentDev.devID = parseInt(msg.payload.Data[13]);\n                                currentDev.prodID = parseInt(msg.payload.Data[14]);\n                                currentDev.serNr = parseInt(msg.payload.Data[15]);\n                                SVList.push(currentDev);\n                                flow.set(\"SVList\", SVList)\n                                var retMsg = {payload:\"-1\",options:[]};\n                                for (var i= 0; i < SVList.length; i++)\n                                {\n                                    retMsg.options.push(lnAddr.toString());\n                                    if (SVList[i].lnAddr == lnAddr)\n                                    {\n                                        retMsg.payload = lnAddr;\n                                        flow.set(\"SVSel\", i);\n                                    }\n                                }\n                                return [retMsg, zeroMsg, zeroMsg, zeroMsg, zeroMsg, zeroMsg, zeroMsg];\n                            }\n                            break;\n                        }\n                }\n                break;\n            }\n        default: \n            {\n                break;\n            }\n    }\n    return null;\n}\n",
        "outputs": 7,
        "noerr": 0,
        "x": 468,
        "y": 2103,
        "wires": [
            [
                "b3b16580.1bf878",
                "a74af5c2.cf95d8"
            ],
            [
                "4c4e519.0fb84b"
            ],
            [
                "f690c769.136de8"
            ],
            [
                "80d524f5.415e48"
            ],
            [
                "d34ec840.f06ab8"
            ],
            [
                "b4a4cc28.6b972"
            ],
            [
                "fbbb4338.a72dd"
            ]
        ]
    },
    {
        "id": "a74af5c2.cf95d8",
        "type": "ui_dropdown",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "label": "Select LN Device",
        "place": "Select option",
        "group": "f0426ca0.d99b6",
        "order": 2,
        "width": 0,
        "height": 0,
        "passthru": true,
        "options": [
            {
                "label": "",
                "value": "",
                "type": "str"
            }
        ],
        "payload": "",
        "topic": "lnAddr",
        "x": 764,
        "y": 2079,
        "wires": [
            [
                "1ec8d13c.298b8f",
                "615d0328.2b6e4c"
            ]
        ]
    },
    {
        "id": "b3b16580.1bf878",
        "type": "debug",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "options",
        "x": 833,
        "y": 2132,
        "wires": []
    },
    {
        "id": "4c4e519.0fb84b",
        "type": "ui_numeric",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "label": "Memory Position",
        "group": "f0426ca0.d99b6",
        "order": 3,
        "width": 0,
        "height": 0,
        "passthru": true,
        "topic": "memPos",
        "format": "{{value}}",
        "min": 0,
        "max": "1023",
        "step": 1,
        "x": 718,
        "y": 2201,
        "wires": [
            [
                "615d0328.2b6e4c"
            ]
        ]
    },
    {
        "id": "f690c769.136de8",
        "type": "ui_dropdown",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "label": "# of Bytes",
        "place": "",
        "group": "f0426ca0.d99b6",
        "order": 4,
        "width": 0,
        "height": 0,
        "passthru": true,
        "options": [
            {
                "label": "1",
                "value": 0,
                "type": "num"
            },
            {
                "label": "4",
                "value": 1,
                "type": "num"
            }
        ],
        "payload": "",
        "topic": "numBytes",
        "x": 924,
        "y": 2201,
        "wires": [
            [
                "615d0328.2b6e4c"
            ]
        ]
    },
    {
        "id": "80d524f5.415e48",
        "type": "ui_numeric",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "label": "Data 1",
        "group": "f0426ca0.d99b6",
        "order": 5,
        "width": 0,
        "height": 0,
        "passthru": true,
        "topic": "Data0",
        "format": "{{value}}",
        "min": 0,
        "max": "255",
        "step": 1,
        "x": 675,
        "y": 2246,
        "wires": [
            [
                "615d0328.2b6e4c"
            ]
        ]
    },
    {
        "id": "d34ec840.f06ab8",
        "type": "ui_numeric",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "label": "Data 2",
        "group": "f0426ca0.d99b6",
        "order": 6,
        "width": 0,
        "height": 0,
        "passthru": true,
        "topic": "Data1",
        "format": "{{value}}",
        "min": "-1",
        "max": "255",
        "step": 1,
        "x": 812,
        "y": 2244,
        "wires": [
            [
                "615d0328.2b6e4c"
            ]
        ]
    },
    {
        "id": "b4a4cc28.6b972",
        "type": "ui_numeric",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "label": "Data 3",
        "group": "f0426ca0.d99b6",
        "order": 7,
        "width": 0,
        "height": 0,
        "passthru": true,
        "topic": "Data2",
        "format": "{{value}}",
        "min": "-1",
        "max": "255",
        "step": 1,
        "x": 675,
        "y": 2290,
        "wires": [
            [
                "615d0328.2b6e4c"
            ]
        ]
    },
    {
        "id": "fbbb4338.a72dd",
        "type": "ui_numeric",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "label": "Data 4",
        "group": "f0426ca0.d99b6",
        "order": 8,
        "width": 0,
        "height": 0,
        "passthru": true,
        "topic": "Data3",
        "format": "{{value}}",
        "min": "-1",
        "max": "255",
        "step": 1,
        "x": 840,
        "y": 2283,
        "wires": [
            [
                "615d0328.2b6e4c"
            ]
        ]
    },
    {
        "id": "f6d6e1b5.e9c1",
        "type": "ui_template",
        "z": "ce0d3bcc.85e348",
        "group": "f0426ca0.d99b6",
        "name": "SV Read",
        "order": 9,
        "width": "3",
        "height": "2",
        "format": "<md-button class=\"vibrate filled touched bigfont rounded\" style=\"background-color:#FFFFFF\" ng-click=\"send({payload: 0})\" > \n<svg  width=\"100px\" height=\"60px\" version=\"1.1\" viewBox=\"0 0 800 200\">\n <g id=\"Button_Long_TH\">\n  \n  <rect fill=\"#FFFFFF\" width=\"800\" height=\"200\"/>\n  <g ng-style=\"{fill: 'lime'}\">\n    <rect width=\"800\" height=\"200\" rx=\"80\" ry=\"80\"/>\n  </g>\n  \n  <g ng-style=\"{fill: 'lime'}\">\n    <rect x=\"11\" y=\"10\" width=\"778\" height=\"180\" rx=\"90\" ry=\"90\"/>\n  </g>\n  <g ng-style=\"{fill:'black'}\">\n      \n    <text x=\"400\" y=\"125\" style=\"text-anchor:middle\"  font-weight=\"bold\" font-size=\"80\" font-family=\"Arial\">{{\"READ\"}} </text>\n    </g>\n  </g>\n</svg>\n\n\n</md-button>\n",
        "storeOutMessages": false,
        "fwdInMessages": false,
        "templateScope": "local",
        "x": 262,
        "y": 2303,
        "wires": [
            [
                "615d0328.2b6e4c"
            ]
        ]
    },
    {
        "id": "b5d4f039.ce997",
        "type": "ui_template",
        "z": "ce0d3bcc.85e348",
        "group": "f0426ca0.d99b6",
        "name": "SV Write",
        "order": 10,
        "width": "3",
        "height": "2",
        "format": "<md-button class=\"vibrate filled touched bigfont rounded\" style=\"background-color:#FFFFFF\" ng-click=\"send({payload: 1})\" > \n<svg  width=\"100px\" height=\"60px\" version=\"1.1\" viewBox=\"0 0 800 200\">\n <g id=\"Button_Long_CL\">\n  \n  <rect fill=\"#FFFFFF\" width=\"800\" height=\"200\"/>\n  <g ng-style=\"{fill: 'red'}\">\n    <rect width=\"800\" height=\"200\" rx=\"80\" ry=\"80\"/>\n  </g>\n  \n  <g ng-style=\"{fill: 'red'}\">\n    <rect x=\"11\" y=\"10\" width=\"778\" height=\"180\" rx=\"90\" ry=\"90\"/>\n  </g>\n  <g ng-style=\"{fill:'white'}\">\n      \n    <text x=\"400\" y=\"125\" style=\"text-anchor:middle\"  font-weight=\"bold\" font-size=\"80\" font-family=\"Arial\">{{\"WRITE\"}} </text>\n    </g>\n  </g>\n</svg>\n\n\n</md-button>\n",
        "storeOutMessages": false,
        "fwdInMessages": false,
        "templateScope": "local",
        "x": 261.0694580078125,
        "y": 2354.4375,
        "wires": [
            [
                "615d0328.2b6e4c"
            ]
        ]
    },
    {
        "id": "615d0328.2b6e4c",
        "type": "function",
        "z": "ce0d3bcc.85e348",
        "name": "SV Processor",
        "func": "function createJSON(fromData)\n{\n    var retStr = \"{\\\"From\\\":\\\"Ctrl\\\", \\\"Valid\\\":1, \\\"Data\\\":[\";\n    var xorCode = 0;\n    for (i = 0; i < fromData.length; i++)\n    {\n        var byteCode = parseInt(fromData[i]);\n        //if (byteCode < 0x10)\n        //  retStr = retStr + \"0x0\"\n        //else\n        //  retStr = retStr + \"0x\";\n        retStr = retStr + byteCode.toString() + \",\"\n        xorCode = xorCode ^ byteCode;\n    }\n    xorCode = xorCode ^ 0xFF;\n    retStr = retStr + xorCode.toString() + \"]}\";\n    return retStr;\n}\n\nvar svParams = flow.get(\"SVParams\");\nif (svParams === undefined)\n    svParams = [0,0,0,0,0,0,0,0,];\n    \nif (msg.topic == \"lnAddr\")\n    svParams[0] = msg.payload;\nif (msg.topic == \"memPos\")\n    svParams[1] = msg.payload;\nif (msg.topic == \"numBytes\")\n    svParams[2] = msg.payload;\nif (msg.topic == \"Data0\")\n    svParams[4] = msg.payload;\nif (msg.topic == \"Data1\")\n    svParams[5] = msg.payload;\nif (msg.topic == \"Data2\")\n    svParams[6] = msg.payload;\nif (msg.topic == \"Data3\")\n    svParams[7] = msg.payload;\n\n\nflow.set(\"SVParams\", svParams);\nif (msg.topic === undefined) //read or write\n{\n    var lnMsg = [0xE5,0x10,0x0C,0x07,0x02,0x10,0x00,0x00,0x00,0x00,0x10,0x00,0x00, 0x00, 0x00];\n    var svList = flow.get(\"SVList\");\n    lnMsg[6] = svParams[0] & 0x7F;\n    lnMsg[7] = (svParams[0] & 0x7F00)>>8;\n    lnMsg[5] = lnMsg[5] | ((svParams[0] & 0x80) >> 7) | ((svParams[0] & 0x8000) >> 14);\n    lnMsg[8] = svParams[1] & 0x7F;\n    lnMsg[9] = (svParams[1] & 0x7F00)>>8;\n    lnMsg[5] = lnMsg[5] | ((svParams[1] & 0x80) >> 5) | ((svParams[1] & 0x8000) >> 12);\n    \n    switch (msg.payload)\n    {\n        case 0: //read\n            lnMsg[3] = svParams[2] === 0 ? 0x02 : 0x06;\n            break;\n        case 1: //write\n            lnMsg[3] = svParams[2] === 0 ? 0x01 : 0x05;\n            lnMsg[11] = svParams[4] & 0x7F;\n            lnMsg[12] = svParams[5] & 0x7F;\n            lnMsg[10] = lnMsg[10] | ((svParams[4] & 0x80) >> 7) | ((svParams[5] & 0x80) >> 6);\n            lnMsg[13] = svParams[6] & 0x7F;\n            lnMsg[14] = svParams[7] & 0x7F;\n            lnMsg[10] = lnMsg[10] | ((svParams[6] & 0x80) >> 5) | ((svParams[7] & 0x80) >> 4);\n            break;\n        default: return;\n    }\n    msg = {payload : createJSON(lnMsg)};\n    return msg;\n}\n\n",
        "outputs": 1,
        "noerr": 0,
        "x": 1147,
        "y": 2333,
        "wires": [
            [
                "1e52ada9.613372",
                "299c86b2.887dfa"
            ]
        ]
    },
    {
        "id": "1e52ada9.613372",
        "type": "debug",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "x": 1385,
        "y": 2333,
        "wires": []
    },
    {
        "id": "1ec8d13c.298b8f",
        "type": "debug",
        "z": "ce0d3bcc.85e348",
        "name": "",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "x": 1024,
        "y": 2079,
        "wires": []
    },
    {
        "id": "299c86b2.887dfa",
        "type": "mqtt out",
        "z": "ce0d3bcc.85e348",
        "name": "lnIn",
        "topic": "lnIn",
        "qos": "1",
        "retain": "",
        "broker": "5bc7cc44.39f4b4",
        "x": 1369,
        "y": 2232,
        "wires": []
    },
    {
        "id": "5bc7cc44.39f4b4",
        "type": "mqtt-broker",
        "z": "",
        "name": "IoTTExt",
        "broker": "iott.ddns.net",
        "port": "1883",
        "clientid": "",
        "usetls": false,
        "compatmode": true,
        "keepalive": "60",
        "cleansession": true,
        "birthTopic": "",
        "birthQos": "0",
        "birthRetain": "false",
        "birthPayload": "",
        "closeTopic": "",
        "closePayload": "",
        "willTopic": "",
        "willQos": "0",
        "willPayload": ""
    },
    {
        "id": "882e979e.dec6b8",
        "type": "ui_group",
        "z": "",
        "name": "LocoNet Viewer",
        "tab": "1368abea.a98424",
        "disp": true,
        "width": "6",
        "collapse": false
    },
    {
        "id": "aabbe48e.530ab8",
        "type": "ui_group",
        "z": "",
        "name": "Turnout Control",
        "tab": "1368abea.a98424",
        "order": 3,
        "disp": true,
        "width": "6",
        "collapse": false
    },
    {
        "id": "ce90176a.b864b8",
        "type": "ui_group",
        "z": "",
        "name": "Service Track Programmer",
        "tab": "1368abea.a98424",
        "order": 5,
        "disp": true,
        "width": "6",
        "collapse": false
    },
    {
        "id": "72376ecd.b3567",
        "type": "ui_group",
        "z": "",
        "name": "Main Line Programmer",
        "tab": "1368abea.a98424",
        "order": 6,
        "disp": true,
        "width": "6",
        "collapse": false
    },
    {
        "id": "b81002d.aa397",
        "type": "ui_group",
        "z": "",
        "name": "DCS OpSw Settings",
        "tab": "fdba4392.641a",
        "order": 2,
        "disp": true,
        "width": "6",
        "collapse": false
    },
    {
        "id": "83790385.3291",
        "type": "ui_group",
        "z": "",
        "name": "Signal Control",
        "tab": "1368abea.a98424",
        "order": 4,
        "disp": true,
        "width": "6",
        "collapse": false
    },
    {
        "id": "5fa366d.7609b98",
        "type": "ui_group",
        "z": "",
        "name": "Analog Settings",
        "tab": "1368abea.a98424",
        "order": 7,
        "disp": true,
        "width": "6",
        "collapse": false
    },
    {
        "id": "f0426ca0.d99b6",
        "type": "ui_group",
        "z": "",
        "name": "SV Editor",
        "tab": "1368abea.a98424",
        "order": 8,
        "disp": true,
        "width": "6",
        "collapse": false
    },
    {
        "id": "1368abea.a98424",
        "type": "ui_tab",
        "z": "",
        "name": "LocoNet",
        "icon": "dashboard",
        "order": 4
    },
    {
        "id": "fdba4392.641a",
        "type": "ui_tab",
        "z": "",
        "name": "LocoNet Setup",
        "icon": "dashboard",
        "order": 5
    }
]
