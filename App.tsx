import React, { useState, useCallback } from 'react';
import { INITIAL_ROOMS, MOCK_ENERGY_DATA } from './constants';
import { Room, Message, RoomId, DeviceType } from './types';
import RoomCard from './components/RoomCard';
import ChatWidget from './components/ChatWidget';
import EnergyChart from './components/EnergyChart';
import { processUserCommand } from './services/geminiService';
import { Zap, ShieldCheck, Home, Settings, Bell } from 'lucide-react';

export default function App() {
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'system', text: 'Xin chào! Tôi có thể giúp gì cho hệ thống nhà thông minh của bạn?', timestamp: new Date() }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Core Logic: Update Device State ---
  const handleToggleDevice = useCallback((roomId: string, deviceId: string) => {
    setRooms(prevRooms => prevRooms.map(room => {
      if (room.id !== roomId) return room;
      return {
        ...room,
        devices: room.devices.map(device => {
          if (device.id !== deviceId) return device;
          return { ...device, isOn: !device.isOn };
        })
      };
    }));
  }, []);

  const handleUpdateDeviceFromAI = useCallback((actions: { roomId: string, deviceType: string, operation: string, value?: number }[]) => {
    setRooms(prevRooms => {
      let newRooms = [...prevRooms];
      
      actions.forEach(action => {
        const { roomId, deviceType, operation, value } = action;
        
        newRooms = newRooms.map(room => {
          // Flexible matching for roomId (exact or partial)
          const targetRoom = room.id === roomId || room.id.includes(roomId);
          if (!targetRoom) return room;

          return {
            ...room,
            devices: room.devices.map(device => {
              if (device.type !== deviceType) return device;
              
              let newIsOn = device.isOn;
              let newValue = device.value;

              if (operation === 'turn_on') newIsOn = true;
              else if (operation === 'turn_off') newIsOn = false;
              else if (operation === 'set_value' && value !== undefined) {
                 newValue = value;
                 newIsOn = true; // Auto turn on if setting value
              }

              return { ...device, isOn: newIsOn, value: newValue };
            })
          };
        });
      });
      return newRooms;
    });
  }, []);

  // --- Chat Interaction ---
  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);

    // Call Gemini
    const aiResponseText = await processUserCommand(text, rooms, handleUpdateDeviceFromAI);

    // Add AI response
    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: aiResponseText, timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);
    setIsProcessing(false);
  };

  // --- UI Layout ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-200">
      
      {/* Top Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/30">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                SmartHomeVN
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-500 hover:text-blue-600 transition-colors relative bg-slate-100 rounded-full hover:bg-blue-50">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
                VN
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Quick Stats Header */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-500">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Tiêu thụ</p>
              <p className="text-xl font-bold text-slate-800">24.5 kWh</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl text-green-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">An ninh</p>
              <p className="text-xl font-bold text-slate-800">An toàn</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-xl text-orange-500">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Hệ thống</p>
              <p className="text-xl font-bold text-slate-800">Ổn định</p>
            </div>
          </div>
           {/* Weather/Temp Mock */}
           <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg shadow-blue-500/20 text-white flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Hà Nội</p>
              <p className="text-2xl font-bold">28°C</p>
            </div>
            <div className="text-4xl filter drop-shadow-md">🌤️</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Dashboard - Rooms */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Khu vực</h2>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-500 shadow-sm border border-slate-100">
                  {rooms.reduce((acc, r) => acc + r.devices.filter(d => d.isOn).length, 0)} thiết bị đang bật
                </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rooms.map(room => (
                <RoomCard 
                  key={room.id} 
                  room={room} 
                  onToggleDevice={handleToggleDevice} 
                />
              ))}
            </div>
          </div>

          {/* Sidebar - Energy Chart & Activity */}
          <div className="space-y-6">
             <EnergyChart data={MOCK_ENERGY_DATA} />

             {/* Recent Activity Mock */}
             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800">Hoạt động</h3>
                    <button className="text-blue-500 text-xs font-medium hover:underline">Xem tất cả</button>
                </div>
                <div className="space-y-6">
                    <div className="flex gap-4 relative">
                        <div className="absolute left-[11px] top-6 bottom-[-24px] w-0.5 bg-slate-100 last:hidden"></div>
                        <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0 z-10">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        </div>
                        <div>
                            <p className="text-slate-700 text-sm font-medium">Đèn phòng khách đã tắt</p>
                            <p className="text-slate-400 text-xs mt-1">10 phút trước • Tự động</p>
                        </div>
                    </div>
                    <div className="flex gap-4 relative">
                         <div className="absolute left-[11px] top-6 bottom-[-24px] w-0.5 bg-slate-100"></div>
                        <div className="w-6 h-6 rounded-full bg-green-100 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0 z-10">
                             <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                        <div>
                            <p className="text-slate-700 text-sm font-medium">Cửa chính đã khóa</p>
                            <p className="text-slate-400 text-xs mt-1">30 phút trước • Bởi Admin</p>
                        </div>
                    </div>
                    <div className="flex gap-4 relative">
                        <div className="w-6 h-6 rounded-full bg-orange-100 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0 z-10">
                             <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        </div>
                        <div>
                            <p className="text-slate-700 text-sm font-medium">Phát hiện chuyển động</p>
                            <p className="text-slate-400 text-xs mt-1">1 giờ trước • Camera 02</p>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>

      </main>

      {/* Chat Widget */}
      <ChatWidget 
        messages={messages} 
        onSendMessage={handleSendMessage} 
        isProcessing={isProcessing} 
      />

    </div>
  );
}