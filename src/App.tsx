import React, { useState, useEffect, useRef } from 'react';
import { Stamp as Steam, X, ChevronDown, Download, ArrowUpDown, ShoppingCart, Check, Minus, Copy, LogOut, Loader2 } from 'lucide-react';

type Currency = {
  label: string;
  symbol: string;
};

type FilterOption = {
  label: string;
  value: string;
};

type InventoryItem = {
  id: string;
  name: string;
  image: string;
  basePrice: number;
  marketPrice: number;
  quantity: number;
  inCart: boolean;
};

type User = {
  steamid: string;
  name: string;
  avatar: string;
} | null;

type Game = {
  id: number;
  name: string;
  image: string;
};

type LoadingStep = {
  status: 'pending' | 'loading' | 'success' | 'error';
  message: string;
  errorMessage?: string;
};

const games: Game[] = [
  {
    id: 730,
    name: 'CS2',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/csgo/images/csgo_react/global/logo_cs2.svg'
  },
  {
    id: 570,
    name: 'Dota 2',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/global/dota2_logo_horiz.png'
  },
  {
    id: 252490,
    name: 'Rust',
    image: 'https://rust.facepunch.com/img/double-logo.png'
  },
  {
    id: 440,
    name: 'TF2',
    image: 'https://wiki.teamfortress.com/w/images/thumb/e/e6/Team_Fortress_2_Logo.svg/1200px-Team_Fortress_2_Logo.svg.png'
  }
];

const currencies: Currency[] = [
  { label: 'Рубль', symbol: '₽' },
  { label: 'Доллар', symbol: '$' },
  { label: 'Евро', symbol: '€' },
  { label: 'Юань', symbol: '¥' },
  { label: 'Тенге', symbol: '₸' },
  { label: 'Бел. рубль', symbol: 'Br' },
];

function LoadingModal({ isOpen, steps, onClose }: {
  isOpen: boolean;
  steps: LoadingStep[];
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10001]"
      onClick={handleOverlayClick}
    >
      <div className="bg-[#2C3035] rounded-xl p-6 w-[90%] max-w-[500px] relative">
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-3 right-3 text-white/50 hover:text-[#3C73DD] transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-white/90 mb-6 text-center">
          Загружаем ваш инвентарь
        </h3>

        <div className="flex justify-center mb-6">
          <Loader2 size={48} className="text-[#3C73DD] animate-spin" />
        </div>

        <div className="space-y-4 mb-6">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <p className={`text-sm ${
                step.status === 'loading' ? 'text-white' :
                step.status === 'success' ? 'text-[#3C73DD]' :
                step.status === 'error' ? 'text-[#FF4A4A]' :
                'text-white/50'
              }`}>
                {step.status === 'error' ? (
                  <span dangerouslySetInnerHTML={{ 
                    __html: step.errorMessage?.replace(
                      'Поддержку',
                      '<a href="https://t.me/MannCoSupplyCrateKey" target="_blank" rel="noopener" class="text-[#3C73DD] hover:underline">Поддержку</a>'
                    )?.replace(
                      'настройках профиля',
                      '<a href="https://steamcommunity.com/my/edit/settings" target="_blank" rel="noopener" class="text-[#3C73DD] hover:underline">настройках профиля</a>'
                    ) || ''
                  }} />
                ) : step.message}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-colors duration-300 ${
                step.status === 'success' ? 'bg-[#3C73DD]' :
                step.status === 'error' ? 'bg-[#FF4A4A]' :
                step.status === 'loading' ? 'bg-[#3C73DD] animate-pulse' :
                'bg-[#555555]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function GameSelector({ selectedGame, onSelect }: {
  selectedGame: number;
  onSelect: (gameId: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {games.map((game) => (
        <button
          key={game.id}
          onClick={() => onSelect(game.id)}
          className={`w-[60px] h-[60px] rounded-lg flex items-center justify-center transition-all duration-200 ${
            selectedGame === game.id
              ? 'bg-[#3C73DD]/20 border-2 border-[#3C73DD]'
              : 'bg-[#2C3035] border-2 border-transparent hover:border-[#3C73DD]/50'
          }`}
        >
          <span className="text-sm font-bold text-white/90">{game.name}</span>
        </button>
      ))}
    </div>
  );
}

function AuthModal({ isOpen, onClose, onLogin }: { 
  isOpen: boolean; 
  onClose: () => void;
  onLogin: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10001]">
      <div className="bg-[#2C3035] rounded-xl p-6 w-[90%] max-w-[400px] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        <h3 className="text-xl font-bold text-white/90 mb-4 text-center">
          Для просмотра стоимости инвентаря необходимо авторизоваться
        </h3>
        <div className="flex justify-center">
          <button
            onClick={() => {
              onLogin();
              onClose();
            }}
            className="w-[140px] h-[48px] bg-[#3C73DD] hover:bg-[#4d82ec] transition-colors rounded-xl font-bold text-sm text-white/95 shadow-lg"
          >
            Войти
          </button>
        </div>
      </div>
    </div>
  );
}

function CartSidebar({ isOpen, onClose, items, currency, onRemoveItem }: {
  isOpen: boolean;
  onClose: () => void;
  items: InventoryItem[];
  currency: Currency;
  onRemoveItem: (id: string) => void;
}) {
  const cartItems = items.filter(item => item.inCart);
  const total = cartItems.reduce((sum, item) => sum + item.marketPrice, 0);

  return (
    <div 
      className={`fixed top-0 right-0 w-[320px] h-full bg-[#2C3035] shadow-xl transform transition-transform duration-300 ease-in-out z-[10000] ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ boxShadow: '-4px 0 10px rgba(0, 0, 0, 0.2)' }}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Корзина</h2>
          <button 
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cartItems.map(item => (
            <div 
              key={item.id} 
              className="flex items-center gap-3 p-3 bg-[#191C22] rounded-lg mb-3"
            >
              <img 
                src={item.image} 
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-white/90 mb-1 truncate">
                  {item.name}
                </h3>
                <p className="text-sm font-bold text-[#06FF4C]">
                  {currency.symbol} {item.marketPrice.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="p-1.5 text-white/50 hover:text-white/80 transition-colors"
              >
                <Minus size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-3 mt-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base text-white/70">Итого:</span>
            <span className="text-lg font-bold text-[#06FF4C]">
              {currency.symbol} {total.toFixed(2)}
            </span>
          </div>
          <button className="w-full h-10 bg-[#3C73DD] hover:bg-[#4d82ec] transition-colors rounded-lg font-bold text-sm text-white/90 shadow-md">
            ОФОРМИТЬ ЗАКАЗ
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [profileUrl, setProfileUrl] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [showInventory, setShowInventory] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(730);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>([
    { status: 'pending', message: 'Определяем ваш SteamID' },
    { status: 'pending', message: 'Отправляем запрос на получение предметов' },
    { status: 'pending', message: 'Добавляем цены к предметам' },
    { status: 'pending', message: 'Готово' }
  ]);
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const checkButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    console.log("🔁 Проверка /me...");
    fetch("https://api.buff-163.ru/me", {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Unauthorized');
    })
    .then(userData => {
      if (userData?.steamid) {
        setUser(userData);
        setProfileUrl(`https://steamcommunity.com/profiles/${userData.steamid}`);
      }
    })
    .catch(() => {
      // Silently fail and keep showing login button
    });
  }, []);

  const handleLogin = () => {
    const currentPath = window.location.pathname + window.location.search;
    window.location.href = `https://api.buff-163.ru/login?next=${encodeURIComponent(currentPath)}`;
  };

  const handleLogout = () => {
    window.location.href = 'https://api.buff-163.ru/logout';
  };

  const handleCloseLoadingModal = () => {
    setShowLoadingModal(false);
    setLoadingSteps(steps => steps.map(step => ({ ...step, status: 'pending' })));
    setIsLoading(false);
    checkButtonRef.current?.focus();
  };

  const updateStep = (index: number, status: LoadingStep['status'], errorMessage?: string) => {
    setLoadingSteps(steps => steps.map((step, i) => {
      if (i === index) {
        return { ...step, status, errorMessage };
      } else if (i > index) {
        return { ...step, status: 'pending' };
      }
      return step;
    }));
  };

  const handleInventoryCheck = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsLoading(true);
    setShowLoadingModal(true);
    setLoadingSteps(steps => steps.map(step => ({ ...step, status: 'pending' })));

    try {
      // Step 1: Resolve SteamID
      updateStep(0, 'loading');
      const steamidResponse = await fetch(
        `https://api.buff-163.ru/${selectedGame}/steamid?text=${encodeURIComponent(profileUrl)}`,
        {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (!steamidResponse.ok) {
        throw new Error('steamid');
      }

      const { steamid64 } = await steamidResponse.json();
      updateStep(0, 'success');

      // Step 2: Fetch Inventory
      updateStep(1, 'loading');
      const inventoryResponse = await fetch(
        `https://api.buff-163.ru/inventory/${steamid64}/${selectedGame}`,
        {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (!inventoryResponse.ok) {
        throw new Error('inventory');
      }

      const inventoryData = await inventoryResponse.json();
      updateStep(1, 'success');

      // Step 3: Add Prices (simulated)
      updateStep(2, 'loading');
      await new Promise(resolve => setTimeout(resolve, 1200));
      updateStep(2, 'success');

      // Step 4: Complete
      updateStep(3, 'loading');
      await new Promise(resolve => setTimeout(resolve, 500));
      updateStep(3, 'success');

      // Auto-close after success
      setTimeout(() => {
        setShowLoadingModal(false);
        setShowInventory(true);
      }, 1000);

    } catch (error) {
      const errorType = (error as Error).message;
      
      if (errorType === 'steamid') {
        updateStep(0, 'error', 'Не удалось определить ссылку на ваш профиль, попробуйте позже, или напишите в Поддержку');
      } else if (errorType === 'inventory') {
        updateStep(1, 'error', 'Проверьте, не скрыт ли ваш инвентарь в настройках профиля, если инвентарь открыт и в нем есть предметы, напишите в Поддержку');
      } else {
        updateStep(2, 'error', 'Не удалось определить цены. Попробуйте ещё раз или напишите в Поддержку');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItemInCart = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, inCart: !item.inCart } : item
    ));
  };

  const cartItemCount = items.filter(item => item.inCart).length;

  return (
    <main className="min-h-screen w-full bg-[#191C22] text-white">
      <header className="header-fixed h-20 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-lg font-bold tracking-wide text-white drop-shadow-sm">
            Steam Inventory
          </h1>
        </div>
        
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium text-white/90">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-[#FF4A4A] hover:bg-[#FF5C5C] transition-colors duration-200 px-4 py-2 rounded-xl font-bold text-sm shadow-md flex items-center gap-2"
            >
              <LogOut size={18} />
              ВЫЙТИ
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-[#3C73DD] hover:bg-[#4d82ec] transition-colors duration-200 px-4 py-2 rounded-xl font-bold text-sm shadow-md flex items-center gap-2"
          >
            <Steam size={18} />
            ВОЙТИ ЧЕРЕЗ STEAM
          </button>
        )}
      </header>

      <div className="hero-banner w-full h-[600px] bg-[#212327] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        <img 
          src="https://steaminventory.ru/background.png" 
          alt="Gaming Heroes Banner"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 25%' }}
        />
      </div>

      <div className="p-6 w-full">
        <div className="w-full min-h-[calc(100vh-4rem)] rounded-2xl bg-[#1E2128] p-8 shadow-lg">
          <div className="w-full text-center mt-6 mb-8">
            <p className="text-base leading-relaxed text-white/90 mb-3">
              SkinSpace Sorter – это сервис, позволяющий узнать стоимость инвентаря по каждой игре из вашего аккаунта в Steam.
            </p>
            <p className="text-base leading-relaxed text-white/90">
              Наш сайт позволяет оценить стоимость инвентаря таких игр как: CS:GO, DOTA 2, RUST и других.
            </p>
          </div>

          <div className="w-full">
            <label className="block text-sm text-white/70 mb-4 text-center">
              Вставьте в данное поле ссылку на ваш профиль в Steam, Steam ID или ссылку на Маркет и выберите валюту.
            </label>

            <div className="flex items-center justify-center gap-3 max-w-[1000px] mx-auto">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
                    onFocus={() => !user && setShowAuthModal(true)}
                    placeholder="https://steamcommunity.com/profiles/76561112345678910/"
                    className="w-full h-10 bg-[#313131] border-2 border-[#414141] rounded-lg px-3 text-sm text-white/90 placeholder:text-white/50 focus:outline-none focus:border-[#3C73DD]"
                  />
                  {profileUrl && (
                    <button
                      onClick={() => setProfileUrl('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <button 
                  ref={checkButtonRef}
                  className={`h-10 px-6 bg-[#3C73DD] hover:bg-[#4d82ec] hover:scale-[1.02] transition-all duration-200 rounded-lg font-bold text-sm text-white/95 shadow-lg shadow-[#3C73DD]/20 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-[#3C73DD] flex items-center gap-2`}
                  onClick={handleInventoryCheck}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white/90 rounded-full animate-spin"></div>
                      <span>ЗАГРУЗКА...</span>
                    </>
                  ) : (
                    'УЗНАТЬ СТОИМОСТЬ'
                  )}
                </button>
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="h-10 w-[150px] bg-[#2C3035] rounded-lg px-3 text-sm text-white/90 flex items-center justify-between border-2 border-[#414141] focus:outline-none focus:border-[#3C73DD]"
                >
                  <span>{`${selectedCurrency.label} (${selectedCurrency.symbol})`}</span>
                  <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-12 right-0 w-[150px] bg-[#2C3035] rounded-xl border-2 border-white/20 shadow-lg z-50">
                    {currencies.map((currency) => (
                      <button
                        key={currency.symbol}
                        onClick={() => {
                          setSelectedCurrency(currency);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#3C73DD]/20 transition-colors ${
                          selectedCurrency.symbol === currency.symbol ? 'text-white' : 'text-white/50'
                        }`}
                      >
                        {`${currency.label} (${currency.symbol})`}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <GameSelector
              selectedGame={selectedGame}
              onSelect={setSelectedGame}
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-[#2C3035] rounded-full shadow-lg flex items-center justify-center hover:bg-[#3C3C3C] transition-colors z-[10000]"
        style={{ boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)' }}
      >
        <ShoppingCart size={20} className="text-white" />
        {cartItemCount > 0 && (
          <div className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-[#3C73DD] rounded-full flex items-center justify-center px-1.5 text-xs font-bold text-white">
            {cartItemCount}
          </div>
        )}
      </button>

      <LoadingModal
        isOpen={showLoadingModal}
        steps={loadingSteps}
        onClose={handleCloseLoadingModal}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        currency={selectedCurrency}
        onRemoveItem={toggleItemInCart}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
    </main>
  );
}

export default App;