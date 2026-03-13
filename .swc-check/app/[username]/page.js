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
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
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
import PortfolioPreview from '@/components/portfolio/PortfolioPreview';
import { supabaseAdmin } from '@/lib/supabase_admin';
import { notFound } from 'next/navigation';
export var dynamic = 'force-dynamic';
export var revalidate = 0;
function fetchProfileWithFallback(query, identifier) {
    return _async_to_generator(function() {
        var _ref, profile, error, isCritical, basicQuery, refinedBasicQuery, _ref1, basicProfile, _ref2, oldItems, oldError, _profile_id;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        query
                    ];
                case 1:
                    _ref = _state.sent(), profile = _ref.data, error = _ref.error;
                    if (!error) return [
                        3,
                        3
                    ];
                    console.warn('[Portfolio] Database query error for "'.concat(identifier, '":'), error.message);
                    // Check if we can do a basic fallback for critical schema errors
                    isCritical = error.message.includes('relation') || error.message.includes('column') || error.message.includes('relationship');
                    if (!(isCritical || !profile)) return [
                        3,
                        3
                    ];
                    console.log('[Portfolio] Attempting basic fallback fetch for "'.concat(identifier, '"...'));
                    // Basic query without complex joins
                    basicQuery = supabaseAdmin.from('profiles').select('id, name, role, avatar_url, bio, hourlyRate, username');
                    // Try to match identifier in ID or username or name
                    if (identifier.includes('-') && identifier.length > 30) {
                        refinedBasicQuery = basicQuery.eq('id', identifier);
                    } else {
                        refinedBasicQuery = basicQuery.or("username.ilike.%".concat(identifier, "%,name.ilike.%").concat(identifier, "%,id.ilike.%").concat(identifier, "%")).limit(1);
                    }
                    return [
                        4,
                        refinedBasicQuery.maybeSingle()
                    ];
                case 2:
                    _ref1 = _state.sent(), basicProfile = _ref1.data;
                    if (basicProfile) {
                        console.log("[Portfolio] Found profile via basic fallback: ".concat(basicProfile.name));
                        profile = basicProfile;
                    }
                    _state.label = 3;
                case 3:
                    if (!(profile && (!profile.portfolios || profile.portfolios.length === 0))) return [
                        3,
                        5
                    ];
                    console.log('[Portfolio] No "portfolios" relation data for '.concat(profile.name, " (ID: ").concat(profile.id, "), checking old portfolio_items..."));
                    return [
                        4,
                        supabaseAdmin.from('portfolio_items').select('*').eq('profile_id', profile.id)
                    ];
                case 4:
                    _ref2 = _state.sent(), oldItems = _ref2.data, oldError = _ref2.error;
                    if (oldError) console.error("[Portfolio] Error fetching old items:", oldError.message);
                    if (oldItems && oldItems.length > 0) {
                        ;
                        console.log("[Portfolio] Found ".concat(oldItems.length, " items in old table. Mapping to new structure."));
                        profile.portfolios = [
                            {
                                id: 'fallback-' + (((_profile_id = profile.id) === null || _profile_id === void 0 ? void 0 : _profile_id.toString().substring(0, 8)) || '0000'),
                                about_me: profile.bio || '',
                                tagline: 'Professional Portfolio',
                                theme_settings: {
                                    aesthetic: 'minimalist',
                                    primaryColor: '#000000'
                                },
                                portfolio_projects: oldItems.map(function(item) {
                                    return {
                                        id: item.id,
                                        title: item.title || 'Untitled Project',
                                        description: item.description || '',
                                        image_url: item.image_url || '',
                                        project_url: item.project_url || '',
                                        technologies: Array.isArray(item.technologies) ? item.technologies : typeof item.technologies === 'string' ? item.technologies.split(',').map(function(s) {
                                            return s.trim();
                                        }) : []
                                    };
                                }),
                                portfolio_skills: [],
                                portfolio_links: []
                            }
                        ];
                    }
                    _state.label = 5;
                case 5:
                    return [
                        2,
                        profile
                    ];
            }
        });
    })();
}
function getPortfolio(username) {
    return _async_to_generator(function() {
        var normalizedUsername, hasUrl, hasKey, reservedRoutes, query1, profileByUsername, _ref, count, countError, isUUID, query2, profileById, alphaParts, searchWord, flexibleSearch, _ref1, candidates, candidateError, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, p, _p_name, _p_username, cleanName, cleanDbUsername, cleanRequested, matchByName, matchByUser, matchByPrefix, _ref2, oldItems, _p_id, err, query4, profileByPrefix, err1;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    normalizedUsername = username.startsWith("@") ? username.slice(1) : username;
                    if (!normalizedUsername) return [
                        2,
                        null
                    ];
                    console.log('[Portfolio] Starting lookup for: "'.concat(username, '" (normalized: "').concat(normalizedUsername, '")'));
                    // Debug environment (safely)
                    hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
                    hasKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
                    console.log("[Portfolio] Env status: URL=".concat(hasUrl, ", ServiceKey=").concat(hasKey));
                    // Demo data for testing and local development
                    if (normalizedUsername === 'johndoe' || normalizedUsername === 'demo') {
                        return [
                            2,
                            {
                                id: 'demo-uuid',
                                name: 'John Doe',
                                role: 'Senior Full-stack Developer',
                                avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
                                bio: 'Crafting minimalist, high-performance web applications with a focus on user experience and clean code.',
                                portfolio: {
                                    id: 'portfolio-uuid',
                                    profile_id: 'demo-uuid',
                                    about_me: 'I am a passionate developer from Seoul with 5 years of experience in Next.js and Tailwind CSS. I believe in the power of minimalism and efficiency in software design.',
                                    tagline: 'Minimalist Engineering for Modern Web',
                                    custom_domain: 'https://www.tarawork.online/@johndoe',
                                    projects: [
                                        {
                                            id: 'p1',
                                            title: 'TaraWork Marketplace',
                                            description: 'A professional platform for freelancers and employers with a focus on wellness and sustainability.',
                                            image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
                                            technologies: [
                                                'Next.js',
                                                'TypeScript',
                                                'Supabase'
                                            ],
                                            project_url: 'https://tarawork.ph'
                                        },
                                        {
                                            id: 'p2',
                                            title: 'ZenTask Manager',
                                            description: 'A productivity tool inspired by Korean minimalist design, helping teams focus on what matters.',
                                            image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
                                            technologies: [
                                                'React',
                                                'Framer Motion',
                                                'PostgreSQL'
                                            ]
                                        }
                                    ],
                                    skills: [
                                        {
                                            id: 's1',
                                            name: 'Next.js'
                                        },
                                        {
                                            id: 's2',
                                            name: 'TypeScript'
                                        },
                                        {
                                            id: 's3',
                                            name: 'Tailwind CSS'
                                        },
                                        {
                                            id: 's4',
                                            name: 'UI/UX Design'
                                        }
                                    ],
                                    links: [
                                        {
                                            id: 'l1',
                                            label: 'GitHub',
                                            url: 'https://github.com'
                                        },
                                        {
                                            id: 'l2',
                                            label: 'LinkedIn',
                                            url: 'https://linkedin.com'
                                        }
                                    ],
                                    theme_settings: {
                                        aesthetic: 'minimalist',
                                        primaryColor: '#000000',
                                        premiumProfile: {
                                            tier: 'pro',
                                            verifiedBadge: true,
                                            advancedPortfolio: true,
                                            featuredPlacement: true,
                                            analyticsEnabled: true,
                                            customDomain: 'https://www.tarawork.online/@johndoe',
                                            videoIntroUrl: 'https://www.loom.com/share/portfolio-demo',
                                            introHeadline: 'Helping startups ship elegant, performant products.',
                                            analytics: {
                                                profileViews: 1284,
                                                clientClicks: 91
                                            }
                                        }
                                    }
                                },
                                premiumProfile: {
                                    tier: 'pro',
                                    verifiedBadge: true,
                                    advancedPortfolio: true,
                                    featuredPlacement: true,
                                    analyticsEnabled: true,
                                    customDomain: 'https://www.tarawork.online/@johndoe',
                                    videoIntroUrl: 'https://www.loom.com/share/portfolio-demo',
                                    introHeadline: 'Helping startups ship elegant, performant products.',
                                    analytics: {
                                        profileViews: 1284,
                                        clientClicks: 91
                                    }
                                }
                            }
                        ];
                    }
                    // List of reserved routes that shouldn't be treated as usernames
                    reservedRoutes = [
                        'auth',
                        'api',
                        'admin',
                        'messages',
                        'portfolio',
                        'dashboard',
                        'settings',
                        'projects',
                        'p'
                    ];
                    if (reservedRoutes.includes(normalizedUsername)) {
                        return [
                            2,
                            null
                        ];
                    }
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        18,
                        ,
                        19
                    ]);
                    // 1. Try by username (case-insensitive)
                    console.log('[Portfolio] Step 1: Searching for username: "'.concat(normalizedUsername, '"'));
                    query1 = supabaseAdmin.from('profiles').select("\n        id, name, role, avatar_url, bio, hourlyRate, username,\n        portfolios (id, about_me, tagline, theme_settings, portfolio_projects(*), portfolio_skills(*), portfolio_links(*))\n      ").filter('username', 'ilike', normalizedUsername).maybeSingle();
                    return [
                        4,
                        fetchProfileWithFallback(query1, normalizedUsername)
                    ];
                case 2:
                    profileByUsername = _state.sent();
                    if (profileByUsername) {
                        console.log("[Portfolio] SUCCESS: Found profile by username match: ".concat(normalizedUsername));
                        return [
                            2,
                            mapProfile(profileByUsername)
                        ];
                    }
                    return [
                        4,
                        supabaseAdmin.from('profiles').select('*', {
                            count: 'exact',
                            head: true
                        })
                    ];
                case 3:
                    _ref = _state.sent(), count = _ref.count, countError = _ref.error;
                    console.log("[Portfolio] Total profiles in database: ".concat(count || 0));
                    if (countError) console.error('[Portfolio] Count error:', countError.message);
                    // 2. Try by full UUID
                    isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(normalizedUsername);
                    if (!isUUID) return [
                        3,
                        5
                    ];
                    console.log("[Portfolio] Step 2: Attempting UUID lookup for: ".concat(normalizedUsername));
                    query2 = supabaseAdmin.from('profiles').select("\n          id, name, role, avatar_url, bio, hourlyRate, username,\n          portfolios (id, about_me, tagline, theme_settings, portfolio_projects(*), portfolio_skills(*), portfolio_links(*))\n        ").eq('id', normalizedUsername).maybeSingle();
                    return [
                        4,
                        fetchProfileWithFallback(query2, normalizedUsername)
                    ];
                case 4:
                    profileById = _state.sent();
                    if (profileById) return [
                        2,
                        mapProfile(profileById)
                    ];
                    _state.label = 5;
                case 5:
                    // 3. Robust Match (Fallback) - Aggressive fuzzy search
                    console.log('[Portfolio] Step 3: Aggressive fuzzy match for: "'.concat(normalizedUsername, '"'));
                    alphaParts = normalizedUsername.match(/[a-z]{3,}/gi) || [];
                    searchWord = alphaParts[0] || normalizedUsername || '';
                    flexibleSearch = searchWord.length > 5 ? searchWord.substring(0, 5) : searchWord;
                    return [
                        4,
                        supabaseAdmin.from('profiles').select("\n        id, name, role, avatar_url, bio, hourlyRate, username,\n        portfolios (id, about_me, tagline, theme_settings, portfolio_projects(*), portfolio_skills(*), portfolio_links(*))\n      ").or("name.ilike.%".concat(flexibleSearch, "%,username.ilike.%").concat(flexibleSearch, "%")).limit(10)
                    ];
                case 6:
                    _ref1 = _state.sent(), candidates = _ref1.data, candidateError = _ref1.error;
                    if (candidateError) console.error('[Portfolio] Candidate search error:', candidateError.message);
                    if (!(candidates && candidates.length > 0)) return [
                        3,
                        15
                    ];
                    console.log("[Portfolio] Analyzing ".concat(candidates.length, " candidates for a match..."));
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 7;
                case 7:
                    _state.trys.push([
                        7,
                        13,
                        14,
                        15
                    ]);
                    _iterator = candidates[Symbol.iterator]();
                    _state.label = 8;
                case 8:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        12
                    ];
                    p = _step.value;
                    cleanName = ((_p_name = p.name) === null || _p_name === void 0 ? void 0 : _p_name.toLowerCase().replace(/[^a-z0-9]/g, '')) || '';
                    cleanDbUsername = ((_p_username = p.username) === null || _p_username === void 0 ? void 0 : _p_username.toLowerCase().replace(/[^a-z0-9]/g, '')) || '';
                    cleanRequested = normalizedUsername.toLowerCase().replace(/[^a-z0-9]/g, '');
                    console.log('[Portfolio] Comparing: req="'.concat(cleanRequested, '" with db_name="').concat(cleanName, '" and db_user="').concat(cleanDbUsername, '"'));
                    // Check for multiple matching strategies
                    matchByName = cleanName && (cleanRequested.includes(cleanName) || cleanName.includes(cleanRequested));
                    matchByUser = cleanDbUsername && (cleanRequested.includes(cleanDbUsername) || cleanDbUsername.includes(cleanRequested));
                    matchByPrefix = cleanName.length >= 4 && cleanRequested.startsWith(cleanName.substring(0, 4)) || cleanDbUsername.length >= 4 && cleanRequested.startsWith(cleanDbUsername.substring(0, 4));
                    if (!(matchByName || matchByUser || matchByPrefix)) return [
                        3,
                        11
                    ];
                    console.log("[Portfolio] FOUND MATCH: ".concat(p.name, " (").concat(p.id, ")"));
                    if (!(!p.portfolios || p.portfolios.length === 0)) return [
                        3,
                        10
                    ];
                    return [
                        4,
                        supabaseAdmin.from('portfolio_items').select('*').eq('profile_id', p.id)
                    ];
                case 9:
                    _ref2 = _state.sent(), oldItems = _ref2.data;
                    if (oldItems && oldItems.length > 0) {
                        ;
                        p.portfolios = [
                            {
                                id: 'fallback-' + (((_p_id = p.id) === null || _p_id === void 0 ? void 0 : _p_id.toString().substring(0, 8)) || '0000'),
                                about_me: p.bio || '',
                                tagline: 'Professional Portfolio',
                                theme_settings: {
                                    aesthetic: 'minimalist',
                                    primaryColor: '#000000'
                                },
                                portfolio_projects: oldItems.map(function(item) {
                                    return {
                                        id: item.id,
                                        title: item.title || 'Untitled Project',
                                        description: item.description || '',
                                        image_url: item.image_url || '',
                                        project_url: item.project_url || '',
                                        technologies: Array.isArray(item.technologies) ? item.technologies : []
                                    };
                                }),
                                portfolio_skills: [],
                                portfolio_links: []
                            }
                        ];
                    }
                    _state.label = 10;
                case 10:
                    return [
                        2,
                        mapProfile(p)
                    ];
                case 11:
                    _iteratorNormalCompletion = true;
                    return [
                        3,
                        8
                    ];
                case 12:
                    return [
                        3,
                        15
                    ];
                case 13:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        15
                    ];
                case 14:
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                    return [
                        7
                    ];
                case 15:
                    if (!(normalizedUsername.length >= 8)) return [
                        3,
                        17
                    ];
                    console.log('[Portfolio] Step 4: Attempting prefix lookup for: "'.concat(normalizedUsername, '"'));
                    query4 = supabaseAdmin.from('profiles').select("\n          id, name, role, avatar_url, bio, hourlyRate, username,\n          portfolios (id, about_me, tagline, theme_settings, portfolio_projects(*), portfolio_skills(*), portfolio_links(*))\n        ").filter('id', 'ilike', "".concat(normalizedUsername, "%")).limit(1);
                    return [
                        4,
                        fetchProfileWithFallback(query4, normalizedUsername)
                    ];
                case 16:
                    profileByPrefix = _state.sent();
                    if (profileByPrefix) return [
                        2,
                        mapProfile(profileByPrefix)
                    ];
                    _state.label = 17;
                case 17:
                    return [
                        2,
                        null
                    ];
                case 18:
                    err1 = _state.sent();
                    console.error('Error fetching portfolio:', err1);
                    return [
                        2,
                        null
                    ];
                case 19:
                    return [
                        2
                    ];
            }
        });
    })();
}
// Helper to map DB profile to FreelancerProfile interface
function mapProfile(profile) {
    var _profile_portfolios, _portfolioData_theme_settings, _premiumProfile_billing, _premiumProfile_verifiedProgram;
    var portfolioData = (_profile_portfolios = profile.portfolios) === null || _profile_portfolios === void 0 ? void 0 : _profile_portfolios[0];
    var premiumProfile = portfolioData === null || portfolioData === void 0 ? void 0 : (_portfolioData_theme_settings = portfolioData.theme_settings) === null || _portfolioData_theme_settings === void 0 ? void 0 : _portfolioData_theme_settings.premiumProfile;
    var proExpiryRaw = typeof (premiumProfile === null || premiumProfile === void 0 ? void 0 : (_premiumProfile_billing = premiumProfile.billing) === null || _premiumProfile_billing === void 0 ? void 0 : _premiumProfile_billing.proExpiresAt) === "string" ? premiumProfile.billing.proExpiresAt : "";
    var proExpiryDate = proExpiryRaw ? new Date(proExpiryRaw) : null;
    var hasValidProExpiry = !!proExpiryDate && !Number.isNaN(proExpiryDate.getTime());
    var isExpiredPro = (premiumProfile === null || premiumProfile === void 0 ? void 0 : premiumProfile.tier) === "pro" && hasValidProExpiry && !!proExpiryDate && proExpiryDate.getTime() <= Date.now();
    var normalizedPremiumProfile = premiumProfile ? _object_spread_props(_object_spread({}, premiumProfile), {
        tier: isExpiredPro ? "free" : premiumProfile.tier,
        verifiedBadge: isExpiredPro ? !!((_premiumProfile_verifiedProgram = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram === void 0 ? void 0 : _premiumProfile_verifiedProgram.enrolled) : premiumProfile.verifiedBadge,
        advancedPortfolio: isExpiredPro ? false : premiumProfile.advancedPortfolio,
        featuredPlacement: isExpiredPro ? false : premiumProfile.featuredPlacement,
        analyticsEnabled: isExpiredPro ? false : premiumProfile.analyticsEnabled,
        customDomain: isExpiredPro ? "" : premiumProfile.customDomain,
        videoIntroUrl: isExpiredPro ? "" : premiumProfile.videoIntroUrl,
        billing: premiumProfile.billing ? _object_spread_props(_object_spread({}, premiumProfile.billing), {
            proStatus: isExpiredPro ? "inactive" : premiumProfile.billing.proStatus,
            proLocked: isExpiredPro ? false : premiumProfile.billing.proLocked
        }) : undefined
    }) : undefined;
    return {
        id: profile.id,
        name: profile.name || 'Anonymous',
        role: profile.role || 'Freelancer',
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        hourlyRate: profile.hourlyRate,
        portfolio: portfolioData ? {
            id: portfolioData.id,
            profile_id: profile.id,
            about_me: portfolioData.about_me,
            tagline: portfolioData.tagline,
            custom_domain: portfolioData.custom_domain,
            theme_settings: portfolioData.theme_settings,
            projects: portfolioData.portfolio_projects || [],
            skills: portfolioData.portfolio_skills || [],
            links: portfolioData.portfolio_links || []
        } : undefined,
        premiumProfile: normalizedPremiumProfile
    };
}
export default function PortfolioPage(_0) {
    return _async_to_generator(function(param) {
        var params, resolvedParams, username, profile;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    params = param.params;
                    return [
                        4,
                        params
                    ];
                case 1:
                    resolvedParams = _state.sent();
                    username = resolvedParams.username;
                    return [
                        4,
                        getPortfolio(username)
                    ];
                case 2:
                    profile = _state.sent();
                    if (!profile) {
                        notFound();
                    }
                    return [
                        2,
                        /*#__PURE__*/ React.createElement(PortfolioPreview, {
                            profile: profile,
                            isPublic: true
                        })
                    ];
            }
        });
    }).apply(this, arguments);
}
