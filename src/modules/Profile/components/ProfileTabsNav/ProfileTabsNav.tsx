import { TabsList, TabsTrigger } from '@/components/base/tabs'
import { PROFILE_TAB, PROFILE_TAB_LABEL } from '@/core/constants/profile.constant'
import { useLingui } from '@lingui/react/macro'

const triggerClassName =
    'rounded-none border-0 bg-transparent px-0 py-3 text-sm font-medium text-slate-400 shadow-none data-[state=active]:border-b-2 data-[state=active]:border-slate-800 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none'

const ProfileTabsNav = () => {
    const { t } = useLingui()
    return (
        <TabsList
            variant="line"
            className="mt-4 w-full justify-start rounded-none border-b border-slate-200 bg-transparent px-0"
        >
            <TabsTrigger value={PROFILE_TAB.POSTS} className={`mr-6 ${triggerClassName}`}>
                {t(PROFILE_TAB_LABEL.POSTS)}
            </TabsTrigger>
            <TabsTrigger value={PROFILE_TAB.FOLLOWING} className={triggerClassName}>
                {t(PROFILE_TAB_LABEL.FOLLOWING)}
            </TabsTrigger>
        </TabsList>
    )
}

export default ProfileTabsNav
