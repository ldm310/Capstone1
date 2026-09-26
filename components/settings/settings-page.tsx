"use client";
import { useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCareer } from "@/components/shared/career-provider";
import {
  PageHeading,
  PageMotion,
  Panel,
  RoleSelect,
} from "@/components/shared/primitives";
import { SourceConnector } from "@/components/onboarding/source-connector";
export function SettingsPage({
  profileOnly = false,
}: {
  profileOnly?: boolean;
}) {
  const { profile, updateProfile, notify, reset } = useCareer();
  const [name, setName] = useState(profile.name);
  const [confirm, setConfirm] = useState(false);
  return (
    <PageMotion>
      <PageHeading
        eyebrow="나에게 맞는 커리어 공간"
        title={profileOnly ? "내 프로필 관리" : "내 커리어 설정"}
        description={
          profileOnly
            ? "프로필과 목표 직무를 관리하세요."
            : "데이터 소스와 체험 상태를 관리하세요."
        }
      />
      <div className="settings-content">
        <Panel title="기본 프로필" subtitle="이 브라우저에 저장됩니다">
          <form
            className="settings-profile"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return;
              updateProfile({ name: name.trim() });
              notify("프로필을 저장했습니다.");
            }}
          >
            <label className="field-label">
              표시 이름
              <input
                required
                className="form-input"
                maxLength={40}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <div className="field-label">
              대표 희망 직무
              <RoleSelect />
            </div>
            <Button type="submit">
              <Save size={14} />
              프로필 저장
            </Button>
          </form>
        </Panel>
        {!profileOnly && (
          <>
            <Panel
              title="연결한 자료"
              subtitle="체험 연결입니다 · 외부 계정에는 접근하지 않습니다"
            >
              <SourceConnector />
            </Panel>
            <Panel
              title="체험 데이터"
              subtitle="활동, 추가한 근거, 자료 연결, 지원 기록을 초기화합니다"
            >
              <div className="row-between">
                <p className="small-copy">
                  초기 샘플 데이터로 돌아갑니다. 직접 추가한 로컬 체험 기록이
                  제거됩니다.
                </p>
                <Button variant="outline" onClick={() => setConfirm(true)}>
                  <RotateCcw size={14} />
                  체험 데이터 초기화
                </Button>
              </div>
            </Panel>
          </>
        )}
      </div>
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogTitle>체험 데이터를 초기화할까요?</DialogTitle>
          <DialogDescription>
            이 브라우저에서 추가한 역량 근거, 활동 진행 상태, 지원 기록과 프로필
            설정이 초기화됩니다.
          </DialogDescription>
          <div className="button-row">
            <Button variant="outline" onClick={() => setConfirm(false)}>
              취소
            </Button>
            <Button
              onClick={() => {
                reset();
                setName("Dongmin");
                setConfirm(false);
              }}
            >
              체험 데이터 초기화
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageMotion>
  );
}
