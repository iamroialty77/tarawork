function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _ts_generator(thisArg, body) {
    var f, y, t, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype), d = Object.defineProperty;
    return d(g, "next", {
        value: verb(0)
    }), d(g, "throw", {
        value: verb(1)
    }), d(g, "return", {
        value: verb(2)
    }), typeof Symbol === "function" && d(g, Symbol.iterator, {
        value: function() {
            return this;
        }
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
// PDFParse is imported dynamically inside POST handler
export var dynamic = 'force-dynamic';
export var maxDuration = 60;
export var runtime = 'nodejs';
export function POST(req) {
    return _async_to_generator(function() {
        var headers, contentType, formData, file, buffer, _, text, PDFParse, parser, data, parseError, object, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    console.log('AI Resume Parser: Request received');
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        10,
                        ,
                        11
                    ]);
                    headers = {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    };
                    // Ensure Content-Type is correct for formData
                    contentType = req.headers.get('content-type') || '';
                    if (!contentType.includes('multipart/form-data')) {
                        return [
                            2,
                            NextResponse.json({
                                error: 'Invalid content type. Expected multipart/form-data.'
                            }, {
                                status: 400
                            })
                        ];
                    }
                    return [
                        4,
                        req.formData()
                    ];
                case 2:
                    formData = _state.sent();
                    file = formData.get('file');
                    if (!file) {
                        console.error('AI Resume Parser: No file uploaded');
                        return [
                            2,
                            NextResponse.json({
                                error: 'No file uploaded'
                            }, {
                                status: 400,
                                headers: headers
                            })
                        ];
                    }
                    // New: Check for PDF MIME type
                    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
                        console.error('AI Resume Parser: Invalid file type:', file.type);
                        return [
                            2,
                            NextResponse.json({
                                error: 'Please upload a PDF file.'
                            }, {
                                status: 400,
                                headers: headers
                            })
                        ];
                    }
                    // New: Check for file size (5MB limit)
                    if (file.size > 10 * 1024 * 1024) {
                        console.error('AI Resume Parser: File too large:', file.size);
                        return [
                            2,
                            NextResponse.json({
                                error: 'File too large. Maximum size is 10MB.'
                            }, {
                                status: 400,
                                headers: headers
                            })
                        ];
                    }
                    console.log("AI Resume Parser: Processing ".concat(file.name, " (").concat(file.size, " bytes)"));
                    _ = Buffer.from;
                    return [
                        4,
                        file.arrayBuffer()
                    ];
                case 3:
                    buffer = _.apply(Buffer, [
                        _state.sent()
                    ]);
                    console.log('AI Resume Parser: Extracting text from PDF...');
                    text = '';
                    _state.label = 4;
                case 4:
                    _state.trys.push([
                        4,
                        7,
                        ,
                        8
                    ]);
                    // Polyfill necessary for pdfjs-dist in Node.js environment
                    // We use lightweight shims instead of @napi-rs/canvas to avoid native binding build errors in Turbopack
                    console.log('AI Resume Parser: Injecting lightweight polyfills...');
                    if (!globalThis.DOMMatrix) {
                        globalThis.DOMMatrix = /*#__PURE__*/ function() {
                            "use strict";
                            function DOMMatrix(init) {
                                _class_call_check(this, DOMMatrix);
                                _define_property(this, "matrix", void 0);
                                this.matrix = init;
                            }
                            _create_class(DOMMatrix, null, [
                                {
                                    key: "fromFloat32Array",
                                    value: function fromFloat32Array(array) {
                                        return new DOMMatrix(array);
                                    }
                                },
                                {
                                    key: "fromFloat64Array",
                                    value: function fromFloat64Array(array) {
                                        return new DOMMatrix(array);
                                    }
                                }
                            ]);
                            return DOMMatrix;
                        }();
                    }
                    if (!globalThis.Path2D) {
                        globalThis.Path2D = /*#__PURE__*/ function() {
                            "use strict";
                            function Path2D() {
                                _class_call_check(this, Path2D);
                            }
                            _create_class(Path2D, [
                                {
                                    key: "addPath",
                                    value: function addPath() {}
                                },
                                {
                                    key: "closePath",
                                    value: function closePath() {}
                                },
                                {
                                    key: "moveTo",
                                    value: function moveTo() {}
                                },
                                {
                                    key: "lineTo",
                                    value: function lineTo() {}
                                },
                                {
                                    key: "bezierCurveTo",
                                    value: function bezierCurveTo() {}
                                },
                                {
                                    key: "quadraticCurveTo",
                                    value: function quadraticCurveTo() {}
                                },
                                {
                                    key: "arc",
                                    value: function arc() {}
                                },
                                {
                                    key: "arcTo",
                                    value: function arcTo() {}
                                },
                                {
                                    key: "ellipse",
                                    value: function ellipse() {}
                                },
                                {
                                    key: "rect",
                                    value: function rect() {}
                                }
                            ]);
                            return Path2D;
                        }();
                    }
                    if (!globalThis.DOMPoint) {
                        globalThis.DOMPoint = /*#__PURE__*/ function() {
                            "use strict";
                            function DOMPoint() {
                                var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, _$z = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0, w = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 1;
                                _class_call_check(this, DOMPoint);
                                _define_property(this, "x", void 0);
                                _define_property(this, "y", void 0);
                                _define_property(this, "z", void 0);
                                _define_property(this, "w", void 0);
                                this.x = x;
                                this.y = y;
                                this.z = _$z;
                                this.w = w;
                            }
                            _create_class(DOMPoint, null, [
                                {
                                    key: "fromPoint",
                                    value: function fromPoint(other) {
                                        return new DOMPoint(other.x, other.y, other.z, other.w);
                                    }
                                }
                            ]);
                            return DOMPoint;
                        }();
                    }
                    if (!globalThis.DOMRect) {
                        globalThis.DOMRect = /*#__PURE__*/ function() {
                            "use strict";
                            function DOMRect() {
                                var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, width = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0, height = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
                                _class_call_check(this, DOMRect);
                                _define_property(this, "x", void 0);
                                _define_property(this, "y", void 0);
                                _define_property(this, "width", void 0);
                                _define_property(this, "height", void 0);
                                _define_property(this, "top", void 0);
                                _define_property(this, "right", void 0);
                                _define_property(this, "bottom", void 0);
                                _define_property(this, "left", void 0);
                                this.x = x;
                                this.y = y;
                                this.width = width;
                                this.height = height;
                                this.top = y;
                                this.left = x;
                                this.right = x + width;
                                this.bottom = y + height;
                            }
                            _create_class(DOMRect, null, [
                                {
                                    key: "fromRect",
                                    value: function fromRect(other) {
                                        return new DOMRect(other.x, other.y, other.width, other.height);
                                    }
                                }
                            ]);
                            return DOMRect;
                        }();
                    }
                    return [
                        4,
                        import('pdf-parse')
                    ];
                case 5:
                    PDFParse = _state.sent().PDFParse;
                    // Wrap in Promise to ensure asynchronous execution
                    parser = new PDFParse({
                        data: buffer,
                        verbosity: 0 // Avoid too many logs from pdfjs
                    });
                    return [
                        4,
                        parser.getText({
                            lineEnforce: true,
                            lineThreshold: 4.0 // More sensitive for multi-column layouts like those in Canva
                        })
                    ];
                case 6:
                    data = _state.sent();
                    text = data.text;
                    return [
                        3,
                        8
                    ];
                case 7:
                    parseError = _state.sent();
                    console.error('AI Resume Parser: PDF Parse Error:', parseError);
                    return [
                        2,
                        NextResponse.json({
                            error: "Failed to read PDF file: ".concat(parseError.message)
                        }, {
                            status: 400,
                            headers: headers
                        })
                    ];
                case 8:
                    if (!text || text.trim().length === 0) {
                        console.error('AI Resume Parser: No text extracted');
                        return [
                            2,
                            NextResponse.json({
                                error: 'Could not extract text from PDF. Please ensure the PDF is not just a scanned image or try a different file.'
                            }, {
                                status: 400,
                                headers: headers
                            })
                        ];
                    }
                    console.log("AI Resume Parser: Extracted ".concat(text.length, " characters. Calling AI..."));
                    if (!process.env.OPENAI_API_KEY) {
                        console.warn('AI Resume Parser: OPENAI_API_KEY is missing');
                        // Return a basic extraction if OpenAI is not available
                        return [
                            2,
                            NextResponse.json({
                                name: file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' '),
                                bio: "Successfully extracted text (".concat(text.length, " chars) but AI parsing is currently unavailable. Manual profile completion required."),
                                skills: [],
                                category: 'General'
                            }, {
                                headers: headers
                            })
                        ];
                    }
                    return [
                        4,
                        generateObject({
                            model: openai('gpt-4o-mini'),
                            schema: z.object({
                                name: z.string().optional(),
                                bio: z.string().optional(),
                                skills: z.array(z.string()).optional(),
                                experience: z.array(z.object({
                                    company: z.string(),
                                    role: z.string(),
                                    duration: z.string(),
                                    description: z.string()
                                })).optional(),
                                category: z.enum([
                                    'General',
                                    'Developer',
                                    'Designer',
                                    'Graphic Design',
                                    'Writer',
                                    'Marketing Specialist',
                                    'Marketing',
                                    'Virtual Assistant',
                                    'Admin/VA',
                                    'Customer Support',
                                    'Sales',
                                    'Project Management',
                                    'QA/Testing',
                                    'Data Entry',
                                    'Finance/Accounting',
                                    'IT & Networking',
                                    'Writing & Content',
                                    'Data & Automation',
                                    'Other'
                                ]).optional()
                            }),
                            prompt: "Extract professional information from the following resume text. \nNote: The text might have been extracted from a multi-column or complex layout (like Canva). \nUse your natural language understanding to reassemble sections correctly if they seem fragmented.\n\nResume Text:\n\n\n".concat(text, "\n\n\nPlease provide a concise bio, a list of technical and soft skills, and a summary of work experience. \nAlso categorize the person into one of the following: General, Developer, Designer, Graphic Design, Writer, Marketing Specialist, Marketing, Virtual Assistant, Admin/VA, Customer Support, Sales, Project Management, QA/Testing, Data Entry, Finance/Accounting, IT & Networking, Writing & Content, Data & Automation, Other.")
                        })
                    ];
                case 9:
                    object = _state.sent().object;
                    console.log('AI Resume Parser: Successfully parsed');
                    return [
                        2,
                        NextResponse.json(object, {
                            headers: headers
                        })
                    ];
                case 10:
                    error = _state.sent();
                    console.error('AI Resume Parser: Unhandled Error:', error);
                    return [
                        2,
                        NextResponse.json({
                            error: error.message || 'An unexpected error occurred during resume parsing'
                        }, {
                            status: 500,
                            headers: {
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                                'Access-Control-Allow-Headers': 'Content-Type'
                            }
                        })
                    ];
                case 11:
                    return [
                        2
                    ];
            }
        });
    }).call(this);
}
export function OPTIONS() {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                NextResponse.json({}, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    }
                })
            ];
        });
    })();
}
export function GET() {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                NextResponse.json({
                    message: 'AI Resume Parser API is online. Use POST to parse a resume file.'
                })
            ];
        });
    })();
}
