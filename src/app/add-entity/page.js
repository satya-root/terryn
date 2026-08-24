import Navbar from "@/components/custom/Navbar";
import Footer from "@/components/custom/Footer";
import AddEntityForm from "@/components/custom/AddEntityForm";
import { getProfileCookie } from '@/app/actions/auth';
import { redirect } from 'next/navigation';

export default async function AddEntity() {
  const profile = await getProfileCookie();
  
  if (!profile || profile.role !== 'CITIZEN') {
    redirect('/login?callbackUrl=/add-entity');
  }

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50">
      {/* Light Wire mesh background element */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/4 translate-y-1/4"></div>

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />
        
        <div className="flex-1 max-w-[1280px] w-full mx-auto px-6 sm:px-8 lg:px-12 py-32">
          <AddEntityForm />
        </div>

        <Footer />
      </div>
    </main>
  );
}
