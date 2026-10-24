import React, { useState } from 'react';

export default function KiwiMateApp() {
  const [mode, setMode] = useState('customer'); // 'customer' or 'provider'
  const [activeRegion, setActiveRegion] = useState('전체 (All Auckland)');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [step, setStep] = useState(1); // 1: Category, 2: Details, 3: Done
  const [requestTitle, setRequestTitle] = useState('');
  const [requestSchedule, setRequestSchedule] = useState('');
  
  const [requests, setRequests] = useState([
    {
      id: 1,
      region: 'Milford',
      category: '잔디 깎기 & 정원 관리',
      title: '뒷마당 잔디 깎기 및 잡초 제거 부탁드립니다.',
      schedule: '이번 주 내로',
      author: '김민수',
      status: '접수됨',
      budget: '$80 NZD'
    },
    {
      id: 2,
      region: 'Westgate',
      category: '핸디맨 & 집수리',
      title: '현관문 방충망 교체 및 문고리 수리',
      schedule: '다음 주 주말',
      author: 'Sarah Lee',
      status: '견적 대기중',
      budget: '$120 NZD'
    }
  ]);

  const [quotes, setQuotes] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // request object
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [escrowStatus, setEscrowStatus] = useState('none'); // none, deposited, completed

  const categories = [
    { id: 'garden', name: '잔디 깎기 & 정원 관리', icon: '🌿', desc: '정기 잔디 깎기, 울타리 정리, 잡초 제거' },
    { id: 'handyman', name: '핸디맨 & 집수리', icon: '🔧', desc: '방충망, 문고리, 페인트 보수, 가구 조립' },
    { id: 'moving', name: '소형 이사 & 가구 운송', icon: '🚚', desc: '중고 가구 픽업, 트레일러 운송, 짐 옮기기' },
    { id: 'tech', name: '전문 기술 & 맞춤 제작', icon: '💻', desc: '3D CAD, 기계 설계, 3D 프린팅, 태양광 점검' }
  ];

  const regions = ['전체 (All Auckland)', 'Milford', 'Westgate', 'Albany', 'CBD'];

  const handleCreateRequest = () => {
    if (!requestTitle) return;
    const newReq = {
      id: Date.now(),
      region: activeRegion === '전체 (All Auckland)' ? 'Milford' : activeRegion,
      category: selectedCategory.name,
      title: requestTitle,
      schedule: requestSchedule || '협의 가능',
      author: mode === 'customer' ? '박병욱 (나)' : '현지 주민',
      status: '접수됨',
      budget: '$100 NZD'
    };
    setRequests([newReq, ...requests]);
    setStep(3);
  };

  const sendQuote = (req) => {
    const newQuote = {
      requestId: req.id,
      requestTitle: req.title,
      provider: '박병욱 (Pro)',
      price: '$100 NZD',
      msg: '안녕하세요! 이웃 주민의 요청을 받고 안전하고 깔끔하게 처리해 드리겠습니다.'
    };
    setQuotes([...quotes, newQuote]);
    alert('견적서가 고객에게 전송되었습니다!');
  };

  const startChat = (req) => {
    setActiveChat(req);
    setMessages([
      { sender: 'system', text: `${req.author}님과의 채팅방이 연결되었습니다. 에스크로 안전결제를 진행할 수 있습니다.` }
    ]);
    setEscrowStatus('none');
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages([...messages, { sender: 'me', text: chatInput }]);
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-12">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-600">KiwiMate</span>
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">Auckland</span>
          </div>

          {/* Mode Switcher */}
          <div className="bg-gray-100 p-1 rounded-full flex space-x-1">
            <button 
              onClick={() => { setMode('customer'); setActiveChat(null); }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${mode === 'customer' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
            >
              고객 · 맡기기
            </button>
            <button 
              onClick={() => { setMode('provider'); setActiveChat(null); }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${mode === 'provider' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
            >
              고수 · 일찾기
            </button>
          </div>
        </div>

        {/* Region Filter Bar */}
        <div className="max-w-md mx-auto px-4 pb-3 flex space-x-2 overflow-x-auto no-scrollbar">
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setActiveRegion(reg)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition ${activeRegion === reg ? 'bg-blue-600 text-white font-medium' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              📍 {reg}
            </button>
          ))}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto px-4 pt-4">

        {/* ================= CHAT VIEW ================= */}
        {activeChat ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-[75vh]">
            {/* Chat Header */}
            <div className="p-3 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">{activeChat.title}</h3>
                <p className="text-xs text-gray-500">상대방: {activeChat.author}</p>
              </div>
              <button 
                onClick={() => setActiveChat(null)}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-medium"
              >
                나가기
              </button>
            </div>

            {/* Escrow Status Banner */}
            <div className="bg-blue-50 p-3 border-b border-blue-100 text-xs flex items-center justify-between">
              <div>
                <span className="font-semibold text-blue-700">안전결제(에스크로): </span>
                <span>{escrowStatus === 'none' && '대금 예치 전'}</span>
                <span>{escrowStatus === 'deposited' && '예치 완료 (작업 진행중)'}</span>
                <span>{escrowStatus === 'completed' && '정산 완료 ✓'}</span>
              </div>
              <div>
                {escrowStatus === 'none' && (
                  <button 
                    onClick={() => setEscrowStatus('deposited')}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md font-medium shadow-sm hover:bg-blue-700"
                  >
                    안전결제 예치하기
                  </button>
                )}
                {escrowStatus === 'deposited' && (
                  <button 
                    onClick={() => setEscrowStatus('completed')}
                    className="bg-green-600 text-white px-3 py-1 rounded-md font-medium shadow-sm hover:bg-green-700"
                  >
                    작업 완료 승인
                  </button>
                )}
              </div>
            </div>

            {/* Message List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  {m.sender === 'system' ? (
                    <div className="bg-gray-100 text-gray-600 text-xs p-2.5 rounded-xl w-full text-center">
                      {m.text}
                    </div>
                  ) : (
                    <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${m.sender === 'me' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                      {m.text}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-gray-100 flex space-x-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="메시지를 입력하세요..." 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <button 
                onClick={sendMessage}
                className="bg-blue-
