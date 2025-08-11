import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllPrivacy } from '../../Redux/Slice/PrivacyPolicy.slice';

const PrivacyPolacy = () => {

  const sections = useSelector((state) => state.policy.Privacy);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPrivacy());
  }, []);

  return (
    <>
      <div className="bg-[#0f0f0f] text-white px-[24px] md:px-[40px] xl:px-[80px] pb-0 pt-[60px] md:py-[60px] inter-font h-screen">
        {/* Main Content */}
        <section className="py-[20px] md:py-[40px] space-y-[20px] md:space-y-[40px]">
          <div>
            <h1 className="text-[20px] md:text-[30px] font-bold mb-2 md:mb-4">
              Privacy Policy
            </h1>

            <div className="space-y-4">
              {sections.map((section, index) => (
                <div key={index}>
                  <h2 className="text-base md:text-lg font-semibold mb-2">
                    {section.title}
                  </h2>
                  <div className="text-sm xl:text-[15px] font-normal text-white/60 mb-[10px] leading-relaxed" dangerouslySetInnerHTML={{ __html: section.description }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default PrivacyPolacy
