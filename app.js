const { useState, useEffect } = React;

// Toast utility function
const showToast = (title, description, duration = 3000) => {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'bg-slate-800 border border-purple-500/30 rounded-lg p-4 shadow-lg text-white max-w-sm transform transition-all duration-300 translate-x-full opacity-0';
    toast.innerHTML = `
        <div class="font-semibold text-sm">${title}</div>
        <div class="text-xs text-gray-300 mt-1">${description}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
};

// Icon components (simplified SVG icons)
const HeartIcon = ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="m19 14c1.49-1.46 3-3.21 3-5.5a5.5 5.5 0 0 0-11 0c0 2.29 1.51 4.04 3 5.5l4 4z"/>
        <path d="m12 5l-4 4 4 4 4-4z"/>
    </svg>
);

const FilterIcon = ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
    </svg>
);

const ZapIcon = ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
    </svg>
);

const Gamepad2Icon = ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <line x1="6" x2="10" y1="12" y2="12"/>
        <line x1="8" x2="8" y1="10" y2="14"/>
        <line x1="15" x2="15.01" y1="13" y2="13"/>
        <line x1="18" x2="18.01" y1="11" y2="11"/>
        <rect width="20" height="12" x="2" y="6" rx="2"/>
    </svg>
);

const ExternalLinkIcon = ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="m15 3h6v6"/>
        <path d="m10 14 11-11"/>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    </svg>
);

const BellIcon = ({ size = 18, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
        <path d="m13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
);

const BellOffIcon = ({ size = 18, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5"/>
        <path d="M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7"/>
        <path d="m2 2 20 20"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
);

const BanIcon = ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <circle cx="12" cy="12" r="10"/>
        <path d="m4.9 4.9 14.2 14.2"/>
    </svg>
);

const XIcon = ({ size = 12, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="m18 6-12 12"/>
        <path d="m6 6 12 12"/>
    </svg>
);

// Main component
const LovenseLinkHub = () => {
    const [links, setLinks] = useState([]);
    const [selectedToys, setSelectedToys] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedLinkType, setSelectedLinkType] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [notificationPermission, setNotificationPermission] = useState('default');
    const [previousLinkCount, setPreviousLinkCount] = useState(0);
    const [blacklistWords, setBlacklistWords] = useState([]);
    const [newBlacklistWord, setNewBlacklistWord] = useState('');
    const [showBlacklist, setShowBlacklist] = useState(false);
    const [blockedTags, setBlockedTags] = useState([]);
    const [newBlockedTag, setNewBlockedTag] = useState('');
    const [showBlockedTags, setShowBlockedTags] = useState(false);

    const toyOptions = [
        "lush", "ferri", "ambi", "flexer", "hyphy", "tenera", "dolce", "domi",
        "exomoon", "gemini", "gravity", "lapis", "mini xmachine", "xmachine",
        "mission", "nora", "osci", "vulse"
    ];

    const tagOptions = [
        "#W4M", "#W4W", "#W4A", "#M4M", "#M4W", "#M4A", "#NB4M", "#NB4W",
        "#NB4NB", "#NB4A", "#alwaysonline", "#lookingforfriends", "Custom Tags"
    ];

    const linkTypeOptions = [
        { value: 1, label: "Type 1" },
        { value: 2, label: "Type 2" }
    ];

    const fetchLinks = async () => {
        try {
            const response = await fetch("https://apps2.lovense-api.com/api/link-hub/link/list", {
                method: "POST",
                headers: {
                    "accept": "*/*",
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    pf: "android",
                    version: "7.50.0",
                    linkTypes: selectedLinkType ? [selectedLinkType] : [1, 2],
                    tags: tagOptions,
                    customTag: false,
                }),
            });

            const data = await response.json();
            const list = data?.data?.list || [];
            const filtered = list.filter((item) => {
                const description = item.description || '';
                const hasBlacklistedWord = blacklistWords.some(word => 
                    description.toLowerCase().includes(word.toLowerCase())
                );
                
                if (hasBlacklistedWord) {
                    return false;
                }
                
                if (blockedTags.length > 0) {
                    const hasBlockedTag = item.tags.some(tag => 
                        blockedTags.some(blockedTag => 
                            tag.toLowerCase().includes(blockedTag.toLowerCase())
                        )
                    );
                    if (hasBlockedTag) {
                        return false;
                    }
                }
                
                const toyMatch = selectedToys.length === 0 || item.toys.some(toy => selectedToys.includes(toy.toyName.toLowerCase()));
                const tagMatch = selectedTags.length === 0 || item.tags.some(tag => selectedTags.includes(tag));
                
                if (selectedToys.length > 0 && toyMatch) {
                    return true;
                }
                
                return toyMatch && tagMatch;
            });

            setLinks((prev) => {
                const existingLinks = new Map(prev.map(link => [link.shortCode, link]));
                const newLinks = filtered.filter((link) => !existingLinks.has(link.shortCode));
                
                if (newLinks.length === 0) return prev;
                
                return [...newLinks, ...prev];
            });
        } catch (error) {
            console.error('Error fetching links:', error);
        }
    };

    useEffect(() => {
        fetchLinks();
        const interval = setInterval(fetchLinks, 1000);
        return () => clearInterval(interval);
    }, [selectedToys, selectedTags, selectedLinkType, blacklistWords, blockedTags]);

    useEffect(() => {
        if ('Notification' in window) {
            setNotificationPermission(Notification.permission);
            const savedNotificationSetting = localStorage.getItem('lovense-notifications-enabled');
            if (savedNotificationSetting === 'true' && Notification.permission === 'granted') {
                setNotificationsEnabled(true);
            }
        }
        
        const savedBlacklist = localStorage.getItem('lovense-blacklist-words');
        if (savedBlacklist) {
            setBlacklistWords(JSON.parse(savedBlacklist));
        }
        
        const savedBlockedTags = localStorage.getItem('lovense-blocked-tags');
        if (savedBlockedTags) {
            setBlockedTags(JSON.parse(savedBlockedTags));
        } else {
            const savedM4WBlock = localStorage.getItem('lovense-block-m4w');
            if (savedM4WBlock === 'true') {
                setBlockedTags(['m4w']);
                localStorage.setItem('lovense-blocked-tags', JSON.stringify(['m4w']));
                localStorage.removeItem('lovense-block-m4w');
            }
        }
    }, []);

    useEffect(() => {
        if (notificationsEnabled && notificationPermission === 'granted' && links.length > 0) {
            const newLinksCount = links.length - previousLinkCount;
            
            if (previousLinkCount > 0 && newLinksCount > 0) {
                new Notification('🔗 New Control Links Available!', {
                    body: `${newLinksCount} new control link${newLinksCount > 1 ? 's' : ''} just appeared`,
                    icon: '/favicon.ico',
                    tag: 'lovense-new-links',
                    requireInteraction: false
                });

                showToast(
                    "🔗 New Links Found!",
                    `${newLinksCount} new control links are now available`,
                    4000
                );
            }
            
            setPreviousLinkCount(links.length);
        } else if (links.length > 0 && previousLinkCount === 0) {
            setPreviousLinkCount(links.length);
        }
    }, [links, notificationsEnabled, notificationPermission, previousLinkCount]);

    const toggleToy = (toy) => {
        setSelectedToys((prev) => prev.includes(toy) ? prev.filter(t => t !== toy) : [...prev, toy]);
    };

    const toggleTag = (tag) => {
        setSelectedTags((prev) => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const toggleLinkType = (linkType) => {
        setSelectedLinkType(prev => prev === linkType ? null : linkType);
    };

    const clearLinks = () => {
        setLinks([]);
    };

    const clearAllFilters = () => {
        setSelectedToys([]);
        setSelectedTags([]);
        setSelectedLinkType(null);
    };

    const handleNotificationToggle = async (enabled) => {
        if (enabled && 'Notification' in window) {
            if (Notification.permission === 'default') {
                const permission = await Notification.requestPermission();
                setNotificationPermission(permission);
                
                if (permission === 'granted') {
                    setNotificationsEnabled(true);
                    localStorage.setItem('lovense-notifications-enabled', 'true');
                    showToast(
                        "🔔 Notifications Enabled!",
                        "You'll be notified when new control links appear"
                    );
                } else {
                    showToast(
                        "❌ Permission Denied",
                        "Please enable notifications in your browser settings"
                    );
                }
            } else if (Notification.permission === 'granted') {
                setNotificationsEnabled(true);
                localStorage.setItem('lovense-notifications-enabled', 'true');
                showToast(
                    "🔔 Notifications Enabled!",
                    "You'll be notified when new control links appear"
                );
            } else {
                showToast(
                    "❌ Notifications Blocked",
                    "Please enable notifications in your browser settings"
                );
            }
        } else {
            setNotificationsEnabled(false);
            localStorage.setItem('lovense-notifications-enabled', 'false');
            showToast(
                "🔕 Notifications Disabled",
                "You won't receive alerts for new links"
            );
        }
    };

    const addBlacklistWord = () => {
        const word = newBlacklistWord.trim();
        if (word && !blacklistWords.includes(word)) {
            const updatedWords = [...blacklistWords, word];
            setBlacklistWords(updatedWords);
            localStorage.setItem('lovense-blacklist-words', JSON.stringify(updatedWords));
            setNewBlacklistWord('');
            showToast(
                "🚫 Word Blocked",
                `Links containing "${word}" will be hidden`
            );
        }
    };

    const removeBlacklistWord = (wordToRemove) => {
        const updatedWords = blacklistWords.filter(word => word !== wordToRemove);
        setBlacklistWords(updatedWords);
        localStorage.setItem('lovense-blacklist-words', JSON.stringify(updatedWords));
        showToast(
            "✅ Word Unblocked",
            `Links containing "${wordToRemove}" will now appear`
        );
    };

    const addBlockedTag = () => {
        const tag = newBlockedTag.trim().toLowerCase();
        if (tag && !blockedTags.includes(tag)) {
            const updatedTags = [...blockedTags, tag];
            setBlockedTags(updatedTags);
            localStorage.setItem('lovense-blocked-tags', JSON.stringify(updatedTags));
            setNewBlockedTag('');
            showToast(
                "🚫 Tag Blocked",
                `Links with "${tag}" tag will be hidden`
            );
        }
    };

    const removeBlockedTag = (tagToRemove) => {
        const updatedTags = blockedTags.filter(tag => tag !== tagToRemove);
        setBlockedTags(updatedTags);
        localStorage.setItem('lovense-blocked-tags', JSON.stringify(updatedTags));
        showToast(
            "✅ Tag Unblocked",
            `Links with "${tagToRemove}" tag will now appear`
        );
    };

    const formatDuration = (duration) => {
        if (!duration) return '00:00:00';
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const isSelected = (list, item) => list.includes(item);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 relative overflow-hidden">
            {/* Subtle Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 -right-4 w-96 h-96 bg-pink-500/10 rounded-full filter blur-3xl"></div>
            </div>

            {/* Header */}
            <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-purple-500/30 shadow-lg">
                <div className="px-3 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                                <HeartIcon size={20} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Lovense Link Hub
                                </h1>
                                <p className="text-xs text-gray-400">Professional Control Center</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 w-full sm:w-auto items-center">
                            {/* Blacklist Toggle */}
                            <div className="relative">
                                <button 
                                    onClick={() => setShowBlacklist(!showBlacklist)}
                                    className="bg-slate-800/50 border border-red-500/30 text-red-400 hover:bg-slate-700 hover:border-red-400/50 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                    <BanIcon size={16} />
                                    Block ({blacklistWords.length})
                                </button>
                                {showBlacklist && (
                                    <div className="absolute right-0 top-full mt-2 bg-slate-800 border border-red-500/30 rounded-xl shadow-2xl p-4 max-w-[90vw] sm:max-w-md w-80 z-50">
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-sm text-red-300 flex items-center">
                                                <BanIcon size={16} className="mr-2" />
                                                Block Words in Descriptions
                                            </h3>
                                            
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Enter word to block..."
                                                    value={newBlacklistWord}
                                                    onChange={(e) => setNewBlacklistWord(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && addBlacklistWord()}
                                                    className="bg-slate-700 border border-slate-600 text-gray-200 placeholder-gray-400 px-3 py-2 rounded-lg flex-1 text-sm"
                                                />
                                                <button 
                                                    onClick={addBlacklistWord}
                                                    disabled={!newBlacklistWord.trim()}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                                                >
                                                    Block
                                                </button>
                                            </div>

                                            {blacklistWords.length > 0 && (
                                                <div className="space-y-2">
                                                    <p className="text-xs text-gray-400">Blocked Words:</p>
                                                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                                        {blacklistWords.map((word, index) => (
                                                            <div 
                                                                key={index}
                                                                className="flex items-center gap-1 bg-red-600/20 text-red-200 text-xs px-2 py-1 rounded border border-red-500/30"
                                                            >
                                                                <span>{word}</span>
                                                                <button
                                                                    onClick={() => removeBlacklistWord(word)}
                                                                    className="text-red-400 hover:text-red-200 ml-1"
                                                                >
                                                                    <XIcon size={12} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Blocked Tags Toggle */}
                            <div className="relative">
                                <button 
                                    onClick={() => setShowBlockedTags(!showBlockedTags)}
                                    className="bg-slate-800/50 border border-orange-500/30 text-orange-400 hover:bg-slate-700 hover:border-orange-400/50 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                    <BanIcon size={16} />
                                    Block Tags ({blockedTags.length})
                                </button>
                                {showBlockedTags && (
                                    <div className="absolute right-0 top-full mt-2 bg-slate-800 border border-orange-500/30 rounded-xl shadow-2xl p-4 max-w-[90vw] sm:max-w-md w-80 z-50">
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-sm text-orange-300 flex items-center">
                                                <BanIcon size={16} className="mr-2" />
                                                Block Tags
                                            </h3>
                                            
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Enter tag to block (e.g., m4w)..."
                                                    value={newBlockedTag}
                                                    onChange={(e) => setNewBlockedTag(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && addBlockedTag()}
                                                    className="bg-slate-700 border border-slate-600 text-gray-200 placeholder-gray-400 px-3 py-2 rounded-lg flex-1 text-sm"
                                                />
                                                <button 
                                                    onClick={addBlockedTag}
                                                    disabled={!newBlockedTag.trim()}
                                                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                                                >
                                                    Block
                                                </button>
                                            </div>

                                            {blockedTags.length > 0 && (
                                                <div className="space-y-2">
                                                    <p className="text-xs text-gray-400">Blocked Tags:</p>
                                                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                                        {blockedTags.map((tag, index) => (
                                                            <div 
                                                                key={index}
                                                                className="flex items-center gap-1 bg-orange-600/20 text-orange-200 text-xs px-2 py-1 rounded border border-orange-500/30"
                                                            >
                                                                <span>{tag}</span>
                                                                <button
                                                                    onClick={() => removeBlockedTag(tag)}
                                                                    className="text-orange-400 hover:text-orange-200 ml-1"
                                                                >
                                                                    <XIcon size={12} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Notification Toggle */}
                            <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-md px-4 py-2 rounded-full border border-purple-500/30 shadow-lg">
                                {notificationsEnabled ? (
                                    <BellIcon size={18} className="text-purple-400" />
                                ) : (
                                    <BellOffIcon size={18} className="text-gray-500" />
                                )}
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={notificationsEnabled}
                                        onChange={(e) => handleNotificationToggle(e.target.checked)}
                                    />
                                    <div className={`w-11 h-6 rounded-full transition-colors ${notificationsEnabled ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-600'}`}>
                                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'} mt-0.5`}></div>
                                    </div>
                                </label>
                                <span className="text-sm text-gray-300 font-medium hidden sm:inline">
                                    Notifications
                                </span>
                            </div>

                            {/* Filter Toggle */}
                            <div className="relative">
                                <button 
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg border-0 flex items-center gap-2"
                                >
                                    <FilterIcon size={16} />
                                    Filter ({(selectedToys.length + selectedTags.length + (selectedLinkType ? 1 : 0))})
                                </button>
                                {showFilters && (
                                    <div className="absolute right-0 top-full mt-2 bg-slate-800 border border-purple-500/30 rounded-xl shadow-2xl p-4 max-w-[90vw] sm:max-w-md w-80 z-50 max-h-[70vh] overflow-y-auto">
                                        <div className="space-y-4">
                                            {/* Link Type Filter */}
                                            <div>
                                                <h3 className="font-semibold text-sm text-gray-300 mb-2 flex items-center">
                                                    <ZapIcon size={16} className="mr-2" />
                                                    Link Type:
                                                </h3>
                                                <div className="flex gap-2">
                                                    {linkTypeOptions.map(option => (
                                                        <button
                                                            key={option.value}
                                                            className={`text-sm px-3 py-2 rounded-lg transition-all ${selectedLinkType === option.value ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' : 'bg-slate-700 border border-slate-600 text-gray-300 hover:bg-slate-600'}`}
                                                            onClick={() => toggleLinkType(option.value)}
                                                        >
                                                            {option.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Toy Type Filter */}
                                            <div>
                                                <h3 className="font-semibold text-sm text-gray-300 mb-2 flex items-center">
                                                    <Gamepad2Icon size={16} className="mr-2" />
                                                    Toy Type:
                                                </h3>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                                                    {toyOptions.map(toy => (
                                                        <button
                                                            key={toy}
                                                            className={`text-xs capitalize h-8 px-2 rounded-lg transition-all ${isSelected(selectedToys, toy) ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-slate-700 border border-slate-600 text-gray-300 hover:bg-slate-600'}`}
                                                            onClick={() => toggleToy(toy)}
                                                        >
                                                            {toy}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Tags Filter */}
                                            <div>
                                                <h3 className="font-semibold text-sm text-gray-300 mb-2 flex items-center">
                                                    <HeartIcon size={16} className="mr-2" />
                                                    Tags:
                                                </h3>
                                                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                                                    {tagOptions.filter(tag => tag !== "Custom Tags").map(tag => (
                                                        <button
                                                            key={tag}
                                                            className={`text-xs h-8 px-2 rounded-lg transition-all ${isSelected(selectedTags, tag) ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-slate-700 border border-slate-600 text-gray-300 hover:bg-slate-600'}`}
                                                            onClick={() => toggleTag(tag)}
                                                        >
                                                            {tag}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Control Buttons */}
                                            <div className="flex gap-2 pt-2 border-t border-slate-600">
                                                <button
                                                    onClick={clearAllFilters}
                                                    className="bg-slate-700 hover:bg-slate-600 text-gray-300 px-3 py-2 rounded-lg text-xs flex-1"
                                                >
                                                    Clear Filters
                                                </button>
                                                <button
                                                    onClick={clearLinks}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs flex-1"
                                                >
                                                    Clear Links
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-slate-800/30 backdrop-blur-md border-b border-purple-500/20 px-3 sm:px-6 py-2">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300 font-medium">
                        {links.length} Links Available
                    </span>
                    <span className="text-purple-300 text-xs">
                        Updates every second
                    </span>
                </div>
            </div>

            {/* Links Grid */}
            <div className="p-3 sm:p-6">
                <div className="grid gap-4 sm:gap-6">
                    {links.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-lg mb-2">No links found</div>
                            <div className="text-gray-500 text-sm">Try adjusting your filters or wait for new links</div>
                        </div>
                    ) : (
                        links.map((link, index) => {
                            const linkType = link.linkType || 1;
                            const isType1 = linkType === 1;
                            const borderColor = isType1 ? 'border-green-500/30' : 'border-purple-500/30';
                            const textColor = isType1 ? 'text-green-400' : 'text-purple-400';
                            const durationColor = isType1 ? 'text-green-400' : 'text-purple-400';
                            
                            return (
                                <div 
                                    key={link.shortCode || index}
                                    className={`bg-slate-800/70 backdrop-blur-md border ${borderColor} rounded-xl p-4 hover:bg-slate-800/90 transition-all duration-300 shadow-lg hover:shadow-xl`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                        <div className="flex-1 space-y-3">
                                            {/* Toys and Duration */}
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                <div className="flex flex-wrap gap-2">
                                                    {link.toys?.map((toy, toyIndex) => (
                                                        <span 
                                                            key={toyIndex}
                                                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${borderColor} ${textColor} bg-slate-700/50`}
                                                        >
                                                            <Gamepad2Icon size={12} />
                                                            {toy.toyName}
                                                        </span>
                                                    ))}
                                                </div>
                                                {link.duration && (
                                                    <div className={`font-mono text-sm font-bold ${durationColor}`}>
                                                        {formatDuration(link.duration)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Description */}
                                            {link.description && (
                                                <p className="text-gray-300 text-sm leading-relaxed">
                                                    {link.description}
                                                </p>
                                            )}

                                            {/* Tags */}
                                            {link.tags && link.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {link.tags.map((tag, tagIndex) => (
                                                        <span 
                                                            key={tagIndex}
                                                            className={`px-2 py-1 rounded-full text-xs border ${borderColor} ${textColor} bg-slate-700/30`}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Link Button */}
                                        <div className="flex flex-col gap-2 sm:ml-4">
                                            <div className={`text-xs ${textColor} font-medium text-center`}>
                                                Type {linkType}
                                            </div>
                                            <a
                                                href={link.longTimeControlLinkUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-lg hover:shadow-xl transform hover:scale-105 ${
                                                    isType1 
                                                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                                                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                                                }`}
                                            >
                                                <ExternalLinkIcon size={16} />
                                                Control
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

// Render the app
ReactDOM.render(<LovenseLinkHub />, document.getElementById('root'));