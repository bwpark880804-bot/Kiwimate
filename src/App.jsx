import React, { useState } from 'react';

export default function KiwiMateApp() {
  const [mode, setMode] = useState('customer'); // 'customer' or 'provider'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [step, setStep] = useState(1); // 1: Category, 2: Details, 3: Done
  
  // 고객 상세 입력 필드들
  const [requestTitle, setRequestTitle] = useState('');
  const [requestDetail, setRequestDetail] = useState(''); 
  const [requestCity, setRequestCity] = useState('Auckland (Milford)'); // 기본 선택 지역
  const [requestBudget, setRequestBudget] = useState(''); 
  const [requestDate, setRequestDate] = useState(''); 
  const [requestTime, setRequestTime] = useState(''); 
  
  // 고수 모드 관련 상태
  const [inspectingRequest, setInspectingRequest] = useState(null); 
  const [isWritingQuote, setIsWritingQuote] = useState(false); 
  const [quotePrice, setQuotePrice] = useState(''); 
  const [quoteMessage, setQuoteMessage] = useState(''); 

  const [requests, setRequests] = useState([
    {
      id: 1,
      region: 'Auckland',
      city: 'Auckland (Milford)',
      category: '잔디 깎기 & 정원 관리',
      title: '뒷마당 잔디 깎기 및 잡초 제거 부탁드립니다.',
      detail: '집 뒤편 잔디가 많이 자랐고 울타리 주변 잡초도 같이 정리해 주실 분 찾습니다.',
      schedule: '2026-10-28 (오전 10:00)',
      budget: '$80 NZD',
      author: '김민수',
      status: '접수됨'
    },
    {
      id: 2,
      region: 'Christchurch',
      city: 'Christchurch (Riccarton)',
      category: '핸디맨 & 집수리',
      title: '현관문 방충망 교체 및 문고리 수리',
      detail: '현관 방충망 하단이 찢어졌고 안방 문고리가 헐거워요. 설치만 도와주세요.',
      schedule: '2026-10-31 (오후 2:00)',
      budget: '$120 NZD',
      author: 'Sarah Lee',
      status: '견적 대기중'
    }
  ]);

  const [quotes, setQuotes] = useState([]);
  const [activeChat, setActiveChat] = useState(null); 
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [escrowStatus, setEscrowStatus] = useState('none'); 

  const categories = [
    { id: 'garden', name: '잔디 깎기 & 정원 관리', icon: '🌿', desc: '정기 잔디 깎기, 울타리 정리, 잡초 제거' },
    { id: 'handyman', name: '핸디맨 & 집수리', icon: '🔧', desc: '방충망, 문고리, 페인트 보수, 가구 조립' },
    { id: 'moving', name: '소형 이사 & 가구 운송', icon: '🚚', desc: '중고 가구 픽업, 트레일러 운송, 짐 옮기기' },
    { id: 'tech', name: '전문 기술 & 맞춤 제작', icon: '💻', desc: '3D CAD, 기계 설계, 3D 프린팅, 태양광 점검' }
  ];
  
  // 뉴질랜드 주요 도시 및 서브허브 (요청서 작성 시 클릭 선택용)
  const popularCities = [
    'Auckland (Milford)', 'Auckland (Takapuna)', 'Auckland (Albany)', 'Auckland (CBD)', 
    'Wellington (CBD)', 'Wellington (Lower Hutt)', 
    'Christchurch (Riccarton)', 'Christchurch (CBD)', 
    'Hamilton (CBD)', 'Tauranga (Mount Maunganui)', 'Queenstown (CBD)'
  ];

  const handleCreateRequest = () => {
    if (!requestTitle || !requestDetail) {
      alert('제목과 상세 내용을 모두 입력해 주세요.');
      return;
    }

    const scheduleStr = requestDate ? `${requestDate} ${requestTime ? `(${requestTime})` : ''}` : '협의 가능';
    const mainRegion = requestCity.split(' ')[0];

    const newReq = {
      id: Date.now(),
      region: mainRegion,
      city: requestCity,
      category: selectedCategory.name,
      title: requestTitle,
      detail: requestDetail,
      schedule: scheduleStr,
      budget: requestBudget ? `${requestBudget} NZD` : '협의 가능',
      author: mode === 'customer' ? '박병욱 (나)' : '현지 주민',
      status: '접수됨'
    };

    setRequests([newReq, ...requests]);
    setStep(3);
  };

  const handleSendQuoteSubmit = () => {
    if (!quotePrice || !quoteMessage) {
      alert('제안 금액과 견적 메시지를 모두 입력해 주세요.');
      return;
    }

    const newQuote = {
      requestId: inspectingRequest.id,
      requestTitle: inspectingRequest.title,
      provider: '박병욱 (Pro)',
      price: `${quotePrice} NZD`,
      msg: quoteMessage
    };

    setQuotes([...quotes, newQuote]);
    
    const targetReq = inspectingRequest;
    setInspectingRequest(null);
    setIsWritingQuote(false);
    setQuotePrice('');
    setQuoteMessage('');

    alert('견적서가 고객에게 전송되었습니다! 1:1 채팅방으로 이동합니다.');
    
    setActiveChat(targetReq);
    setMessages([
      { sender: 'system', text: `${targetReq.author}님과의 1:1 채팅방이 열렸습니다.` },
      { sender: 'me', text: `[견적서 전송] 제안 금액: ${newQuote.price}\n내용: ${newQuote.msg}` }
    ]);
    setEscrowStatus('none');
  };

  const startChat = (req) => {
    setActiveChat(req);
    setMessages([
      { sender: 'system', text: `${req.author}님과의 1:1 채팅방이 열렸습니다. 에스크로 결제를 진행하세요.` }
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
      {/* Top Header (지역 선택바 제거 완료) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-600">KiwiMate</span>
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">New Zealand</span>
          </div>

          {/* Mode Switcher */}
          <div className="bg-gray-100 p-1 rounded-full flex space-x-1">
            <button 
              onClick={() => { setMode('customer'); setActiveChat(null); setInspectingRequest(null); setIsWritingQuote(false); }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${mode === 'customer' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
            >
              고객 · 맡기기
            </button>
            <button 
              onClick={() => { setMode('provider'); setActiveChat(null); setIsWritingQuote(false); }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${mode === 'provider' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
            >
              고수 · 일찾기
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto px-4 pt-4">

        {/* ================= CHAT VIEW ================= */}
        {activeChat ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-[75vh]">
            <div className="p-3 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">{activeChat.title}</h3>
                <p className="text-xs text-gray-500">📍 {activeChat.city} · 희망일: {activeChat.schedule}</p>
              </div>
              <button 
                onClick={() => setActiveChat(null)}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-medium"
              >
                나가기
              </button>
            </div>

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

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  {m.sender === 'system' ? (
                    <div className="bg-gray-100 text-gray-600 text-xs p-2.5 rounded-xl w-full text-center">
                      {m.text}
                    </div>
                  ) : (
                    <div className={`max-w-[75%] p-3 rounded-2xl text-sm whitespace-pre-line ${m.sender === 'me' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                      {m.text}
                    </div>
                  )}
                </div>
              ))}
            </div>

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
                  <h2 className="text-lg font-bold text-gray-900">어떤 도움이 필요하신가요?</h2>
                  <p className="text-xs text-gray-500 mt-0.5">뉴질랜드 이웃들에게 요청하고 안전하게 매칭하세요.</p>
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

                <div className="mt-6">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">전국 최근 요청</h3>
                  <div className="space-y-2">
                    {requests.map((req) => (
                      <div key={req.id} className="bg-white p-3 rounded-xl border border-gray-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">📍 {req.city}</span>
                            <span className="text-[10px] text-blue-600 font-semibold">{req.category}</span>
                          </div>
                          <span className="text-xs font-bold text-gray-700">{req.budget}</span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-800">{req.title}</h4>
                        <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg leading-relaxed">{req.detail}</p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-gray-400">📅 {req.schedule}</span>
                          <button 
                            onClick={() => startChat(req)}
                            className="bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-xs px-3 py-1 rounded-lg font-semibold transition"
                          >
                            채팅하기
                          </button>
                        </div>
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
                <h3 className="font-bold text-base mb-1">{selectedCategory.name} 상세 요청 작성</h3>
                <p className="text-xs text-gray-500 mb-4">필요하신 내용과 지역을 선택해 주세요.</p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">요청 제목</label>
                    <input 
                      type="text" 
                      value={requestTitle}
                      onChange={(e) => setRequestTitle(e.target.value)}
                      placeholder="예: 뒷마당 잔디 깎기 및 잡초 제거"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">상세 내용 (자세히 적어주세요)</label>
                    <textarea 
                      rows="3"
                      value={requestDetail}
                      onChange={(e) => setRequestDetail(e.target.value)}
                      placeholder="예: 면적은 대략 50평 정도이며, 잔디가 많이 자라있고 집 주변 잡초도 같이 뽑아주시면 감사하겠습니다."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  {/* 요청 시 지역/도시 선택 UI */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">지역/동네 선택 (클릭)</label>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-gray-50 rounded-xl border border-gray-100">
                      {popularCities.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setRequestCity(c)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${requestCity === c ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                        >
                          📍 {c}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-blue-600 mt-1.5 font-medium">선택된 지역: {requestCity}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">희망 날짜 (NZ 캘린더)</label>
                      <input 
                        type="date" 
                        value={requestDate}
                        onChange={(e) => setRequestDate(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">희망 시간</label>
                      <input 
                        type="time" 
                        value={requestTime}
                        onChange={(e) => setRequestTime(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">희망 예산 ($ NZD)</label>
                    <input 
                      type="text" 
                      value={requestBudget}
                      onChange={(e) => setRequestBudget(e.target.value)}
                      placeholder="예: 100"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">현장 사진 첨부 (선택)</label>
                    <div 
                      onClick={() => alert('사진 첨부 시뮬레이션: 이미지가 첨부되었습니다!')}
                      className="border-2 border-dashed border-gray-200 rounded-xl p-3 text-center text-xs text-gray-400 cursor-pointer hover:border-blue-500 transition"
                    >
                      📷 터치해서 현장 사진 업로드하기
                    </div>
                  </div>

                  <button 
                    onClick={handleCreateRequest}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm shadow-sm transition mt-2"
                  >
                    요청서 등록하기
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center shadow-sm">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">✓</div>
                <h3 className="font-bold text-base mb-1">상세 요청서가 등록되었습니다!</h3>
                <p className="text-xs text-gray-500 mb-6">해당 지역 고수들이 내용을 확인 후 견적을 보냅니다.</p>
                <button 
                  onClick={() => { setStep(1); setRequestTitle(''); setRequestDetail(''); setRequestBudget(''); setRequestDate(''); setRequestTime(''); }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-5 py-2.5 rounded-xl"
                >
                  메인으로 돌아가기
                </button>
              </div>
            )}
          </div>
        ) : (

          /* ================= PROVIDER MODE (고수 일찾기) ================= */
          <div>
            {isWritingQuote && inspectingRequest ? (
              <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm space-y-4">
                <div>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-semibold">견적서 작성</span>
                  <h3 className="font-bold text-base text-gray-900 mt-2">{inspectingRequest.title}</h3>
                  <p className="text-xs text-gray-500">요청자: {inspectingRequest.author} (📍 {inspectingRequest.city})</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">제안할 견적 금액 ($ NZD)</label>
                    <input 
                      type="text" 
                      value={quotePrice}
                      onChange={(e) => setQuotePrice(e.target.value)}
                      placeholder="예: 90 (숫자만 입력)"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">고객에게 보낼 견적 메시지</label>
                    <textarea 
                      rows="4"
                      value={quoteMessage}
                      onChange={(e) => setQuoteMessage(e.target.value)}
                      placeholder="예: 안녕하세요! 요청하신 내용을 보고 연락드립니다. 해당 시간에 방문하여 깔끔하게 작업해 드리겠습니다."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <button 
                      onClick={handleSendQuoteSubmit}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm shadow-sm transition"
                    >
                      견적서 최종 발송하기 & 채팅 시작
                    </button>
                    <button 
                      onClick={() => setIsWritingQuote(false)}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition"
                    >
                      ← 상세 내용으로 돌아가기
                    </button>
                  </div>
                </div>
              </div>
            ) : inspectingRequest ? (
              <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-semibold">{inspectingRequest.category}</span>
                  <span className="text-xs font-bold text-gray-500">요청서 작성자: {inspectingRequest.author}</span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-gray-900 mb-1">{inspectingRequest.title}</h3>
                  <p className="text-xs text-blue-600 font-medium">📍 지역: {inspectingRequest.city}</p>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">고객 상세 요구사항</span>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{inspectingRequest.detail}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-xl">
                  <div>
                    <span className="text-gray-400 block mb-0.5">희망 일정</span>
                    <span className="font-semibold text-gray-800">📅 {inspectingRequest.schedule}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">고객 희망 예산</span>
                    <span className="font-semibold text-blue-600">{inspectingRequest.budget}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button 
                    onClick={() => { 
                      setQuotePrice(inspectingRequest.budget.replace(/[^0-9]/g, '')); 
                      setIsWritingQuote(true); 
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm shadow-sm transition"
                  >
                    이 일감 채택하기 (견적서 작성하기)
                  </button>
                  <button 
                    onClick={() => setInspectingRequest(null)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition"
                  >
                    ← 전체 일감 목록으로 돌아가기
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-900">전국 일감 목록</h2>
                  <p className="text-xs text-gray-500 mt-0.5">올라온 모든 요청서를 확인하고 원하시는 일감을 선택하세요.</p>
                </div>

                <div className="space-y-3">
                  {requests.map((req) => (
                    <div 
                      key={req.id} 
                      onClick={() => setInspectingRequest(req)}
                      className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-blue-400 transition cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">{req.category}</span>
                        <span className="text-xs font-bold text-gray-700">{req.budget}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-gray-800 mb-1">{req.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-1">{req.detail}</p>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-gray-50 text-[11px] text-gray-400">
                        <span>📍 {req.city} · 📅 {req.schedule}</span>
                        <span className="text-blue-600 font-semibold hover:underline">상세보기 →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
