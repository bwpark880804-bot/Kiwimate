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
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto
