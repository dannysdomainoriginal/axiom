import DashboardLayout from "@/components/partials/DashboardLayout";
import UserCard, { UserCardSkeleton } from "@/components/ui/UserCard";
import { useUsers } from "@/hooks/api/useUsers";
import { toast } from "@/libraries/sweetalert2";
import { reportService } from "@/services";
import { LuFileSpreadsheet } from "react-icons/lu";

const ManageUsersPage = () => {
  const { data: allUsers, isLoading, isError } = useUsers();

  const handleDownlodReport = async () => {
    try {
      await reportService.downloadUsersReport();
      toast.success("Your download has started");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="mt-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Team Members</h2>

          <button
            className="flex md:flex download-btn"
            onClick={handleDownlodReport}
          >
            <LuFileSpreadsheet className="text-lg" />
            Download Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {isLoading ? (
            [1, 2, 3].map((_, i) => <UserCardSkeleton key={i} />)
          ) : isError ? (
            <p className="mt-6 text-red-500 text-sm col-span-full">
              Failed to load your team members.
            </p>
          ) : (
            allUsers?.map((user, idx) => (
              <UserCard key={user._id} user={user} delta={idx} />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsersPage;
