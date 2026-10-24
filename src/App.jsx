import React, { useState } from 'react';

export default function KiwiMateApp() {
  const [tab, setTab] = useState('home'); // 'home': 홈, 'requests': 내 요청서, 'chat': 채팅, 'profile': 마이페이지
  const [mode, setMode] = useState('customer'); // 'customer': 고객 모드, 'provider': 고수 모드
  
  // 카테고리 및 요청서 작성 스텝 (숨고식 위젯 폼)
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [requestStep, setRequestStep] = useState(1); // 1: 지역 선택, 2: 상세 내용, 3: 예산/일정, 4: 완료
  
  // 요청서 입력 값들
  const [selectedRegion, setSelectedRegion] = useState('Auckland');
  const [selectedSuburb, setSelectedSuburb] = useState('Milford');
  const [reqTitle, setReqTitle] = useState('');
  const [reqDetail, setReqDetail] = useState('');
  const [reqBudget, setReqBudget] = useState('');
  const [reqDate, setReqDate] = useState('');

  // 전체 요청서 데이터 리스트
  const [requests, setRequests] = useState([
    {
      id: 1,
      category: '정원 · 잔디 관리',
      title: '뒷마당 잔디 깎기 및 잡초 제거 요청',
      detail: '집 뒤편 잔디가 많이 자랐고 울타리 주변 잡초도 같이 정리해 주실 분 찾습니다.',
      region: 'Auckland',
      suburb: 'Milford',
      budget: '$80 NZD',
      date: '2026-10-28',
      author: '김민수',
      quotesCount: 2
    },
    {
      id: 2,
      category: '핸디맨 · 집수리',
      title: '현관문 방충망 교체 및 문고리 수리',
      detail: '현관 방충망 하단이 찢어졌고 안방 문고리가 헐거워요. 설치만 도와주세요.',
      region: 'Christchurch',
      suburb: 'Riccarton',
      budget: '$120 NZD',
      date: '2026-10-31',
      author: 'Sarah Lee',
      quotesCount: 1
    }
  ]);

  // 고수 모드: 상세보기 및 견적 작성 상태
  const [inspectingReq, setInspectingReq] = useState(null);
  const [isWritingQuote, setIsWritingQuote] = useState(false);
  const [myQuotePrice, setMyQuotePrice] = useState('');
  const [myQuoteMsg, setMyQuoteMsg] = useState('');

  // 받은 견적서함 (고객 모드에서 확인)
  const [receivedQuotes, setReceivedQuotes] = useState([
    {
      quoteId: 1,
      requestId: 1,
      requestTitle: '뒷마당 잔디 깎기 및 잡초 제거 요청',
      providerName: '키위 가든텍 (Pro)',
      providerRating: '4.9 (후기 42개)',
      price: '$85 NZD',
      msg: '안녕하세요! 밀퍼드 지역 전문 가든팀입니다. 깔끔하게 정리해 드리겠습니다.'
    }
  ]);

  // 채팅 시스템
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [escrowStatus, setEscrowStatus] = useState('none'); // 'none', 'deposited', 'completed'

  const categories = [
    { id: 'garden', name: '정원 · 잔디 관리', icon: '🌿', desc: '잔디깎기, 잡초제거, 울타리정리' },
    { id: 'handyman', name: '핸디맨 · 집수리', icon: '🔧', desc: '방충망, 문고리, 페인트, 가구조립' },
    { id: 'moving', name: '소형이사 · 운송', icon: '🚚', desc: '중고가구픽업, 트레일러, 짐운반' },
    { id: 'tech', name: '전문기술 · 맞춤제작', icon: '💻', desc: '3D CAD, 기계설계, 3D프린팅' }
  ];

  const nzRegions = ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Tauranga', 'Queenstown'];
  const regionSuburbs = {
    Auckland: ['Milford', 'Takapuna', 'Albany', 'CBD', 'Epsom', 'Howick'],
    Wellington: ['CBD', 'Lower Hutt', 'Upper Hutt', 'Porirua'],
    Christchurch: ['Riccarton', 'CBD', 'Papanui', 'Fendalton'],
    Hamilton: ['CBD', 'Hillcrest', 'Chartwell'],
    Tauranga: ['Mount Maunganui', 'CBD', 'Papamoa'],
    Queenstown: ['CBD', 'Frankton', 'Arrowtown']
  };

  const handleCreateRequest = () => {
    if (!reqTitle || !reqDetail) {
      alert('제목과 상세 내용을 입력해 주세요.');
      return;
    }

    const newReq = {
      id: Date.now(),
      category: selectedCategory.name,
      title: reqTitle,
      detail: reqDetail,
      region: selectedRegion,
      suburb: selectedSuburb,
      budget: reqBudget ? `${reqBudget} NZD` : '협의 가능',
      date: reqDate || '협의 가능',
      author: '박병욱 (나)',
      quotesCount: 0
    };

    setRequests([newReq, ...requests]);
    setRequestStep(4); // 완료 화면으로
  };

  const submitQuote = () => {
    if (!myQuotePrice || !myQuoteMsg) {
      alert('견적 금액과 메시지를 입력해 주세요.');
      return;
    }

    const newQ = {
      quoteId: Date.now(),
      requestId: inspectingReq.id,
      requestTitle: inspectingReq.title,
      providerName: '박병욱 (Top Pro)',
      providerRating: '5.0 (후기 89개)',
      price: `${myQuotePrice} NZD`,
      msg: myQuoteMsg
    };

    setReceivedQuotes([newQ, ...receivedQuotes]);
    setInspectingReq(null);
    setIsWritingQuote(false);
    setMyQuotePrice('');
    setMyQuoteMsg('');
    alert('숨고 스타일 맞춤 견적서가 고객에게 발송되었습니다!');
  };

  const startChatWithProvider = (q) => {
    const targetReq = requests.find(r => r.id === q.requestId) || { title: q.requestTitle, suburb: 'Auckland' };
    setActiveChat({ title: targetReq.title, partner: q.providerName });
    setMessages([
      { sender: 'system', text: `${q.providerName} 고수와의 1:1 견적 상담방이 열렸습니다. 에스크로 안전결제를 진행할 수 있습니다.` },
      { sender: 'partner', text: `[견적서] 제안금액: ${q.price}\n${q.msg}` }
    ]);
    setEscrowStatus('none');
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages([...messages, { sender: 'me', text: chatInput }]);
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans pb-20">
      
      {/* Top Header (숨고 스타일 네이비 브랜드 바) */}
      <header className="bg-slate-900 text-white sticky top-0 z-20 shadow-md">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-black tracking-tight text-amber-400">KiwiMate</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">NZ 숨고 플랫폼</span>
          </div>

          {/* 고객 모드 / 고수 모드 전환 스위치 */}
          <div className="bg-slate-800 p-1 rounded-full flex space-x-1">
            <button 
              onClick={() => { setMode('customer'); setActiveChat(null); setSelectedCategory(null); setTab('home'); }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${mode === 'customer' ? 'bg-amber-400 text-slate-900' : 'text-slate-400'}`}
            >
              고객
            </button>
            <button 
              onClick={() => { setMode('provider'); setActiveChat(null); setSelectedCategory(null); setTab('home'); }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${mode === 'provider' ? 'bg-amber-400 text-slate-900' : 'text-slate-400'}`}
            >
              고수
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto p-4">

        {/* ================= 1. 채팅 화면 ================= */}
        {activeChat ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-[78vh]">
            <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-slate-50 rounded-t-2xl">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{activeChat.title}</h3>
                <p className="text-xs text-blue-600 font-medium">상담 파트너: {activeChat.partner}</p>
              </div>
              <button 
                onClick={() => setActiveChat(null)}
                className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded-lg font-bold"
              >
                나가기
              </button>
            </div>

            {/* 에스크로 안전결제 배너 */}
            <div className="bg-amber-50 p-3 border-b border-amber-100 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-800">에스크로 안전결제: </span>
                <span>{escrowStatus === 'none' && '대금 예치 대기중'}</span>
                <span>{escrowStatus === 'deposited' && '안전결제 완료 (작업중)'}</span>
                <span>{escrowStatus === 'completed' && '거래 완료 ✓'}</span>
              </div>
              <div>
                {escrowStatus === 'none' && (
                  <button onClick={() => setEscrowStatus('deposited')} className="bg-amber-500 text-white px-3 py-1 rounded font-bold shadow hover:bg-amber-600">
                    안전결제 예치
                  </button>
                )}
                {escrowStatus === 'deposited' && (
                  <button onClick={() => setEscrowStatus('completed')} className="bg-emerald-600 text-white px-3 py-1 rounded font-bold shadow hover:bg-emerald-700">
                    작업 완료 승인
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  {m.sender === 'system' ? (
                    <div className="bg-gray-100 text-gray-600 text-xs p-2.5 rounded-xl w-full text-center">{m.text}</div>
                  ) : (
                    <div className={`max-w-[78%] p-3 rounded-2xl text-sm whitespace-pre-line ${m.sender === 'me' ? 'bg-slate-900 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                      {m.text}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-gray-100 flex space-x-2 bg-white rounded-b-2xl">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="메시지를 입력하세요..." 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-900"
              />
              <button onClick={sendMessage} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold">
                전송
              </button>
            </div>
          </div>

        ) : mode === 'customer' ? (

          /* ================= CUSTOMER MODE (고객) ================= */
          tab === 'home' ? (
            <div>
              {/* 숨고 스타일 메인 배너 */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-sm mb-5">
                <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">숨고 스타일 매칭</span>
                <h2 className="text-xl font-black mt-2">어떤 전문가가 필요하신가요?</h2>
                <p className="text-xs text-blue-100 mt-1">견적 요청서를 작성하면 뉴질랜드 전국 고수들이 맞춤 견적을 보내드립니다.</p>
              </div>

              {/* 카테고리 그리드 */}
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">서비스 카테고리</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {categories.map((cat) => (
                  <div 
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat); setRequestStep(1); }}
                    className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-blue-600 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                  >
                    <span className="text-3xl mb-2">{cat.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{cat.name}</h4>
                      <p className="text-[11px] text-gray-500 mt-1 leading-snug">{cat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 받은 견적서 요약 카드 (숨고 핵심 기능) */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm text-gray-900">📬 내가 받은 고수 견적서함</h3>
                  <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">{receivedQuotes.length}건</span>
                </div>
                {receivedQuotes.length === 0 ? (
                  <p className="text-xs text-gray-400 py-3 text-center">아직 도착한 견적서가 없습니다. 요청서를 등록해 보세요!</p>
                ) : (
                  <div className="space-y-2">
                    {receivedQuotes.map((q) => (
                      <div key={q.quoteId} className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-1.5 mb-0.5">
                            <span className="text-xs font-bold text-blue-600">{q.providerName}</span>
                            <span className="text-[10px] text-gray-400">⭐ {q.providerRating}</span>
                          </div>
                          <p className="text-xs font-bold text-gray-800">{q.requestTitle}</p>
                          <p className="text-xs font-bold text-amber-600 mt-0.5">제안 가격: {q.price}</p>
                        </div>
                        <button 
                          onClick={() => startChatWithProvider(q)}
                          className="bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl shadow hover:bg-slate-800"
                        >
                          채팅·상담
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          ) : tab === 'requests' ? (
            /* 내 요청서 관리 탭 */
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">내 요청서 관리</h2>
              <p className="text-xs text-gray-500 mb-4">내가 등록한 일감과 고수들의 입찰 현황을 확인하세요.</p>
              
              <div className="space-y-3">
                {requests.map((req) => (
                  <div key={req.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-bold">{req.category}</span>
                      <span className="text-xs font-bold text-gray-700">{req.budget}</span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900">{req.title}</h3>
                    <p className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-xl">{req.detail}</p>
                    <div className="flex items-center justify-between pt-1 text-[11px] text-gray-400 border-t border-gray-100">
                      <span>📍 {req.region} ({req.suburb}) · 📅 {req.date}</span>
                      <span className="font-bold text-blue-600">입찰 고수: {req.quotesCount}명</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          ) : tab === 'chat' ? (
            /* 채팅함 탭 */
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">숨고 1:1 상담 채팅</h2>
              <p className="text-xs text-gray-500 mb-4">고수와 실시간으로 대화하고 안전결제를 진행하세요.</p>
              
              <div className="space-y-2">
                {receivedQuotes.map((q) => (
                  <div 
                    key={q.quoteId} 
                    onClick={() => startChatWithProvider(q)}
                    className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-500 transition"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{q.providerName}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{q.requestTitle}</p>
                      <span className="text-[10px] text-amber-600 font-bold mt-1 inline-block">제안 금액: {q.price}</span>
                    </div>
                    <button className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl">대화하기</button>
                  </div>
                ))}
              </div>
            </div>

          ) : (
            /* 마이페이지 탭 */
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black">박</div>
              <div>
                <h3 className="font-bold text-base">박병욱 (고객님)</h3>
                <p className="text-xs text-gray-500">Auckland, New Zealand</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl text-left space-y-2 text-xs">
                <div className="flex justify-between"><span>계정 유형</span><span className="font-bold text-blue-600">일반 회원 / 고수 겸용</span></div>
                <div className="flex justify-between"><span>등록한 요청서</span><span className="font-bold">{requests.length}건</span></div>
                <div className="flex justify-between"><span>보유 포인트</span><span className="font-bold">5,000 P</span></div>
              </div>
            </div>
          )

        ) : (

          /* ================= PROVIDER MODE (고수 일찾기) ================= */
          <div>
            {inspectingReq ? (
              /* 고수: 일감 상세 확인 및 견적 작성 화면 */
              isWritingQuote ? (
                <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm space-y-4">
                  <div>
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">숨고 맞춤 견적서 작성</span>
                    <h3 className="font-bold text-base text-gray-900 mt-2">{inspectingReq.title}</h3>
                    <p className="text-xs text-gray-500">요청자: {inspectingReq.author} (📍 {inspectingReq.region})</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">견적 제안 금액 ($ NZD)</label>
                      <input 
                        type="text" 
                        value={myQuotePrice}
                        onChange={(e) => setMyQuotePrice(e.target.value)}
                        placeholder="예: 90 (숫자만 입력)"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">고객에게 보낼 견적 메시지 & 경력 소개</label>
                      <textarea 
                        rows="4"
                        value={myQuoteMsg}
                        onChange={(e) => setMyQuoteMsg(e.target.value)}
                        placeholder="예: 안녕하세요! 해당 분야 5년 경력의 전문가입니다. 깔끔하게 작업해 드리겠습니다."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-900 resize-none"
                      />
                    </div>

                    <div className="space-y-2 pt-2">
                      <button onClick={submitQuote} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-sm shadow hover:bg-slate-800">
                        견적서 최종 발송하기
                      </button>
                      <button onClick={() => setIsWritingQuote(false)} className="w-full bg-gray-100 text-gray-700 font-bold py-2.5 rounded-xl text-sm">
                        ← 상세 내용으로 돌아가기
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold">{inspectingReq.category}</span>
                    <span className="text-xs font-bold text-gray-500">요청자: {inspectingReq.author}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-gray-900 mb-1">{inspectingReq.title}</h3>
                    <p className="text-xs text-blue-600 font-bold">📍 희망 지역: {inspectingReq.region} ({inspectingReq.suburb})</p>
                  </div>

                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-1">
                    <span className="text-[11px] font-bold text-gray-400 uppercase">고객 요구사항 상세</span>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{inspectingReq.detail}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-xl">
                    <div><span className="text-gray-400 block mb-0.5">희망 일정</span><span className="font-bold text-gray-800">📅 {inspectingReq.date}</span></div>
                    <div><span className="text-gray-400 block mb-0.5">고객 예산</span><span className="font-bold text-blue-600">{inspectingReq.budget}</span></div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button 
                      onClick={() => { setMyQuotePrice(inspectingReq.budget.replace(/[^0-9]/g, '')); setIsWritingQuote(true); }}
                      className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-sm shadow hover:bg-slate-800"
                    >
                      맞춤 견적서 보내기
                    </button>
                    <button onClick={() => setInspectingReq(null)} className="w-full bg-gray-100 text-gray-700 font-bold py-2.5 rounded-xl text-sm">
                      ← 일감 목록으로 돌아가기
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-900">숨고 고수 찾기 · 전국 일감 마켓</h2>
                  <p className="text-xs text-gray-500 mt-0.5">뉴질랜드 전역에서 등록된 고객들의 요청서를 확인하고 입찰하세요.</p>
                </div>

                <div className="space-y-3">
                  {requests.map((req) => (
                    <div 
                      key={req.id} 
                      onClick={() => setInspectingReq(req)}
                      className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-slate-900 transition cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold">{req.category}</span>
                        <span className="text-xs font-bold text-slate-900">{req.budget}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-gray-900 mb-1">{req.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-1">{req.detail}</p>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-gray-50 text-[11px] text-gray-400">
                        <span>📍 {req.region} ({req.suburb}) · 📅 {req.date}</span>
                        <span className="text-blue-600 font-bold">견적 보내기 →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* ================= 숨고 스타일 위저드 (카테고리 선택 시 뜨는 상세 요청 팝업 폼) ================= */}
      {selectedCategory && requestStep < 4 && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom duration-200">
            
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">{selectedCategory.name}</span>
                <h3 className="font-black text-base text-gray-900 mt-1">숨고 맞춤 견적 요청서</h3>
              </div>
              <button onClick={() => setSelectedCategory(null)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
            </div>

            {/* 단계별 위저드 폼 */}
            {requestStep === 1 && (
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-gray-800">1단계: 어느 지역에서 서비스가 필요하신가요?</h4>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500">큰 지역 (Region)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {nzRegions.map(reg => (
                      <button
                        key={reg}
                        type="button"
                        onClick={() => { setSelectedRegion(reg); setSelectedSuburb(regionSuburbs[reg][0]); }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${selectedRegion === reg ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-700'}`}
                      >
                        {reg}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-gray-500">세부 동네 (Suburb)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {regionSuburbs[selectedRegion].map(sub => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setSelectedSuburb(sub)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${selectedSuburb === sub ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={() => setRequestStep(2)} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-sm mt-6">
                  다음 단계로 →
                </button>
              </div>
            )}

            {requestStep === 2 && (
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-gray-800">2단계: 작업 내용을 자세히 적어주세요</h4>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">요청 제목</label>
                  <input 
                    type="text" 
                    value={reqTitle} 
                    onChange={e => setReqTitle(e.target.value)} 
                    placeholder="예: 뒷마당 잔디 깎기 및 잡초 제거"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">상세 설명</label>
                  <textarea 
                    rows="3" 
                    value={reqDetail} 
                    onChange={e => setReqDetail(e.target.value)} 
                    placeholder="작업할 공간의 상태, 특이사항 등을 상세히 적어주세요."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-slate-900 resize-none"
                  />
                </div>
                <div className="flex space-x-2 pt-2">
                  <button onClick={() => setRequestStep(1)} className="w-1/3 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl text-sm">이전</button>
                  <button onClick={() => setRequestStep(3)} className="w-2/3 bg-slate-900 text-white font-bold py-3 rounded-xl text-sm">다음 단계로 →</button>
                </div>
              </div>
            )}

            {requestStep === 3 && (
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-gray-800">3단계: 예산과 희망 일정을 알려주세요</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">희망 예산 ($ NZD)</label>
                    <input 
                      type="text" 
                      value={reqBudget} 
                      onChange={e => setReqBudget(e.target.value)} 
                      placeholder="예: 100"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">희망 날짜</label>
                    <input 
                      type="date" 
                      value={reqDate} 
                      onChange={e => setReqDate(e.target.value)} 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button onClick={() => setRequestStep(2)} className="w-1/3 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl text-sm">이전</button>
                  <button onClick={handleCreateRequest} className="w-2/3 bg-blue-600 text-white font-bold py-3 rounded-xl text-sm shadow">
                    견적 요청서 최종 등록하기 🚀
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 요청 완료 화면 모달 */}
      {selectedCategory && requestStep === 4 && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black">✓</div>
            <h3 className="font-black text-lg text-gray-900">견적 요청서 등록 완료!</h3>
            <p className="text-xs text-gray-500 leading-relaxed">전국 고수들에게 요청서가 전달되었습니다.<br/>고수들이 보내오는 맞춤 견적서를 비교해 보세요!</p>
            <button 
              onClick={() => { setSelectedCategory(null); setRequestStep(1); setReqTitle(''); setReqDetail(''); setReqBudget(''); }}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-sm shadow"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* ================= 숨고 스타일 하단 네비게이션 바 ================= */}
      <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-20">
        <div className="max-w-md mx-auto flex justify-around py-2.5 text-xs font-bold text-gray-400">
          <button onClick={() => { setTab('home'); setSelectedCategory(null); setActiveChat(null); }} className={`flex flex-col items-center space-y-1 ${tab === 'home' && !activeChat ? 'text-slate-900' : ''}`}>
            <span className="text-lg">🏠</span>
            <span>홈</span>
          </button>
          <button onClick={() => { setTab('requests'); setSelectedCategory(null); setActiveChat(null); }} className={`flex flex-col items-center space-y-1 ${tab === 'requests' ? 'text-slate-900' : ''}`}>
            <span className="text-lg">📋</span>
            <span>내 요청서</span>
          </button>
          <button onClick={() => { setTab('chat'); setSelectedCategory(null); setActiveChat(null); }} className={`flex flex-col items-center space-y-1 ${tab === 'chat' ? 'text-slate-900' : ''}`}>
            <span className="text-lg">💬</span>
            <span>채팅함</span>
          </button>
          <button onClick={() => { setTab('profile'); setSelectedCategory(null); setActiveChat(null); }} className={`flex flex-col items-center space-y-1 ${tab === 'profile' ? 'text-slate-900' : ''}`}>
            <span className="text-lg">👤</span>
            <span>마이페이지</span>
          </button>
        </div>
      </nav>

    </div>
  );
}
