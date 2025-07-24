import useUIStore from '../../store/useUIStore';
import LayerCardList from './LayerCardList';

const menus = [
  {
    id: 'home',
    label: 'Home',
    src: '/svg/homeIcon.svg',
  },
  {
    id: 'map',
    label: 'Map',
    src: '/svg/mapIcon.svg',
  },
  {
    id: 'filter',
    label: 'Filter',
    src: '/svg/filterIcon.svg',
  },
  {
    id: 'layer',
    label: 'Layer',
    src: '/svg/layerIcon.svg',
  },
];

const MobilePanel = () => {
  const { selectedMobileMenu, setSelectedMobileMenu } = useUIStore();

  return (
    <>
      {/* Mobile Layer Cards */}
      {selectedMobileMenu?.id !== 'home' && <LayerCardList />}

      {/* Mobile Navigation Menu */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[344px] h-[64px] bg-[#426345] rounded-2xl flex items-center justify-between px-8 py-4 lg:hidden shadow-lg">
        {menus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => setSelectedMobileMenu(menu)}
            className="flex flex-col items-center justify-center flex-1"
            aria-label={menu.label}
          >
            <img src={menu.src} alt={menu.label} className="w-6 h-6" />
            <span className="h-2 flex items-center justify-center">
              <span
                className={`rounded-full w-1 h-1 bg-white transition-all duration-200 mt-1 ${
                  selectedMobileMenu.id === menu.id
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-75'
                }`}
              ></span>
            </span>
          </button>
        ))}
      </div>
    </>
  );
};

export default MobilePanel;
