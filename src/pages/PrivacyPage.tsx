import { useNavigate } from 'react-router-dom'

export function PrivacyPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-svh flex-col bg-warm-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-warm-100 px-4 py-3 shadow-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-warm-200 transition-colors"
          aria-label="뒤로가기"
        >
          <span className="text-lg text-[#3d2e26]">‹</span>
        </button>
        <h1 className="text-base font-semibold text-[#3d2e26]">개인정보처리방침</h1>
      </header>

      {/* 본문 */}
      <div className="flex flex-col gap-6 px-5 py-6 pb-32 text-[#3d2e26]">

        <section>
          <p className="text-sm leading-relaxed text-[#8a7570]">
            감사일기(이하 "앱")는 사용자의 개인정보를 매우 중요하게 여기며,
            다음과 같이 개인정보처리방침을 안내합니다.
          </p>
        </section>

        <PolicySection title="1. 수집하는 개인정보 항목">
          <p>
            감사일기는 회원가입, 로그인, 프로필 입력 등의 절차가 없습니다.
            앱 이용을 위해 별도의 개인정보를 수집하거나 외부 서버로 전송하지 않습니다.
          </p>
        </PolicySection>

        <PolicySection title="2. 데이터 저장 방식">
          <p>
            감사 일기, 기분 기록, 설정 등 모든 데이터는 사용자의 기기 내부
            브라우저 저장소(LocalStorage)에만 보관됩니다.
          </p>
          <ul className="mt-2 list-disc pl-5">
            <li>외부 서버로 데이터가 전송되지 않습니다.</li>
            <li>앱 삭제 또는 브라우저 데이터 초기화 시 모든 기록이 사라질 수 있습니다.</li>
            <li>클라우드 동기화 기능을 제공하지 않습니다.</li>
          </ul>
        </PolicySection>

        <PolicySection title="3. 광고 및 광고 식별자">
          <p>
            앱 운영을 위해 Google AdMob(Google LLC) 광고 SDK가 사용됩니다.
            AdMob은 광고 게재 최적화를 위해 광고 ID(Android: GAID)를 수집할 수 있으며,
            해당 정보는 Google의 개인정보처리방침을 따릅니다.
          </p>
          <ul className="mt-2 list-disc pl-5">
            <li>Android 앱 하단에 배너 광고 1개가 표시됩니다.</li>
            <li>전면 광고, 보상형 광고는 제공하지 않습니다.</li>
            <li>감사 기록 작성 화면에는 광고가 표시되지 않습니다.</li>
            <li>광고 ID 수집을 원하지 않으시면 기기 설정에서 광고 개인화를 비활성화할 수 있습니다.</li>
          </ul>
        </PolicySection>

        <PolicySection title="4. 개인정보의 보호">
          <p>
            앱은 사용자 식별 정보를 보유하지 않으므로 개인정보 침해 위험이
            최소화되어 있습니다. 데이터는 오직 사용자 본인의 기기에만 존재합니다.
          </p>
        </PolicySection>

        <PolicySection title="5. 아동의 개인정보">
          <p>
            감사일기는 만 14세 미만 아동을 대상으로 개인정보를 수집하지 않습니다.
          </p>
        </PolicySection>

        <PolicySection title="6. 개인정보처리방침 변경">
          <p>
            본 방침은 법령 변경 또는 서비스 개선에 따라 변경될 수 있습니다.
            변경 시 앱 내 공지를 통해 안내드립니다.
          </p>
        </PolicySection>

        <PolicySection title="7. 문의">
          <p>
            개인정보 관련 문의는 아래 이메일로 연락해 주세요.
          </p>
          <a
            href="mailto:cozybuilder.studio@gmail.com"
            className="mt-1 inline-block text-primary-500 underline"
          >
            cozybuilder.studio@gmail.com
          </a>
        </PolicySection>

        <p className="pt-2 text-xs text-[#8a7570]">최종 업데이트: 2026년 6월 9일</p>
      </div>
    </div>
  )
}

function PolicySection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="mb-2 text-sm font-semibold text-[#3d2e26]">{title}</h2>
      <div className="text-sm leading-relaxed text-[#8a7570]">{children}</div>
    </section>
  )
}
