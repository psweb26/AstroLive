import { AstrologerProfile } from '@/components/astrologers/astrologer-profile';
import { getAstrologer } from '@/src/core/recommendation/dataset';

export default async function AstrologerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AstrologerProfile id={id} directoryAstrologer={getAstrologer(id)} />;
}
