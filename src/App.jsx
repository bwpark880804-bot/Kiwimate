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
      category: '3D CAD & 역설계',
      title: '소형 알루미늄 브래킷 3D 모델링 및 도면화',
      schedule: '이번 주 내로',
      author: '김민수',
      status: '접수됨',
      budget: '$150 NZD'
    },
    {
      id: 2,
      region: 'Westgate',
      category: '정원 & 거터 관리',
      title: '단독주택 뒷마당 잔디 깎기 및 낙엽 청소',
      schedule: '다음 주 주말',
      author: 'Sarah Lee',
      status: '견적 대기중',
      budget: '$100 NZD'
    }
  ]);

  const [quotes, setQuotes] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // request object
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [escrowStatus, setEscrowStatus] = useState('none'); // none, deposited, completed

  const categories = [
    { id: 'cad', name: '3D CAD & 역설계', icon: '💻', desc: '기계 설계, 3D 프린팅 시제품, 도면화' },
    { id: 'solar', name: '태양광 설비 관리', icon: '☀️', desc: '패널 클리닝, 인버터 점검, 유지보수' },
    { id: 'garden', name: '정원 & 거터 관리', icon: '🌿', desc: '잔디 깎기, 지붕 거터 청소, 야외 정돈' },
    { id: 'handyman', name: '생활 심부름 & 조립', icon: '🔧', desc: '가구 조립, 간단 수리, 이사 보조' }
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
      budget: '$120 NZD'
    };
    setRequests([newReq, ...requests]);
    setStep(3);
  };

  const sendQuote = (req) => {
    const newQuote = {
      requestId: req.id,
      requestTitle: req.title,
      provider: '박병욱 (Pro)',
      price: '$120 NZD',
      msg: '안녕하세요! 경력 8년 기계 설계 및 로컬 작업 전문가입니다. 깔끔하고 신속하게 처리해 드리겠습니다.'
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
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
              >
                전송
              </button>
            </div>
          </div>
        ) : mode === 'customer' ? (

          /* ================= CUSTOMER MODE ================= */
          <div>
            {step === 1 && (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-900">어떤 도움이 필요신가요?</h2>
                  <p className="text-xs text-gray-500 mt-0.5">오클랜드 이웃들과 전문가들에게 간편하게 요청하세요.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <div 
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat); setStep(2); }}
                      className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                    >
                      <span className="text-2xl mb-2">{cat.icon}</span>
                      <div>
                        <h3 className="font-bold text-sm text-gray-800">{cat.name}</h3>
                        <p className="text-[11px] text-gray-500 mt-1 leading-snug">{cat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent My Requests */}
                <div className="mt-6">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">우리 동네 최근 요청</h3>
                  <div className="space-y-2">
                    {requests.filter(r => activeRegion === '전체 (All Auckland)' || r.region === activeRegion).map((req) => (
                      <div key={req.id} className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-1.5 mb-1">
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">{req.region}</span>
                            <span className="text-[10px] text-blue-600 font-semibold">{req.category}</span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-800">{req.title}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{req.schedule} · 예산: {req.budget}</p>
                        </div>
                        <button 
                          onClick={() => startChat(req)}
                          className="bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-xs px-3 py-1.5 rounded-lg font-semibold transition"
                        >
                          채팅
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && selectedCategory && (
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <button 
                  onClick={() => setStep(1)} 
                  className="text-xs text-gray-400 hover:text-gray-600 mb-3 block"
                >
                  ← 카테고리 다시 선택
                </button>
                <h3 className="font-bold text-base mb-1">{selectedCategory.name} 요청 작성</h3>
                <p className="text-xs text-gray-500 mb-4">필요하신 내용을 간단히 적어주세요.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">상세 내용</label>
                    <input 
                      type="text" 
                      value={requestTitle}
                      onChange={(e) => setRequestTitle(e.target.value)}
                      placeholder="예: 3D 모델링 도면 작업 또는 정원 잔디 깎기"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">희망 일정</label>
                    <input 
                      type="text" 
                      value={requestSchedule}
                      onChange={(e) => setRequestSchedule(e.target.value)}
                      placeholder="예: 이번 주 주말 / ASAP"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button 
                    onClick={handleCreateRequest}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm shadow-sm transition"
                  >
                    요청서 등록하기
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center shadow-sm">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">✓</div>
                <h3 className="font-bold text-base mb-1">요청서가 등록되었습니다!</h3>
                <p className="text-xs text-gray-500 mb-6">동네 고수들이 확인 후 견적을 보내드립니다.</p>
                <button 
                  onClick={() => { setStep(1); setRequestTitle(''); setRequestSchedule(''); }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-5 py-2.5 rounded-xl"
                >
                  메인으로 돌아가기
                </button>
              </div>
            )}
          </div>
        ) : (

          /* ================= PROVIDER MODE ================= */
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">들어온 요청서 목록</h2>
              <p className="text-xs text-gray-500 mt-0.5">내 동네({activeRegion})의 이웃들이 올린 일감입니다.</p>
            </div>

            <div className="space-y-3">
              {requests.filter(r => activeRegion === '전체 (All Auckland)' || r.region === activeRegion).map((req) => (
                <div key={req.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">{req.category}</span>
                    <span className="text-xs font-bold text-gray-700">{req.budget}</span>
                  </div>
                  <h3 className="font-bold text-sm text-gray-800 mb-1">{req.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">📍 {req.region} · 일정: {req.schedule} · 요청자: {req.author}</p>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => sendQuote(req)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-semibold transition"
                    >
                      견적 보내기
                    </button>
                    <button 
                      onClick={() => startChat(req)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-semibold transition"
                    >
                      채팅하기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
