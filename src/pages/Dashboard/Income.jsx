import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import IncomeOverview from '../../components/Income/IncomeOverview';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Modal from '../../components/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import toast from 'react-hot-toast';
import IncomeList from '../../components/Income/IncomeList';
import DeleteAlert from '../../components/DeleteAlert';
import { useUserAuth } from '../../hooks/useUserAuth';
import DummyDataButton from '../../components/DummyDataButton';

const Income = () => {
    useUserAuth();

    const [incomeData, setIncomeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });
    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

    // Fetch Income Data
    const fetchIncomeDetails = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
            setIncomeData(response.data.incomes || []);
        } catch (error) {
            console.error("Failed to fetch income data:", error);
            toast.error("Could not load income data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle Add Income
    const handleAddIncome = async (income) => {
        const { source, amount, date, icon } = income;

        // Validation Checks
        if (!source.trim() || !amount || isNaN(amount) || Number(amount) <= 0 || !date) {
            toast.error("Please fill all fields correctly.");
            return;
        }

        try {
            const response = await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
                source,
                amount,
                date,
                icon,
            });
            
            // Refresh the income data after adding
            await fetchIncomeDetails();
            setOpenAddIncomeModal(false);
            toast.success("Income added successfully");
        } catch (error) {
            console.error("Error while adding income:", error);
            toast.error(error.response?.data?.message || "Failed to add income.");
        }
    };

    // Handle Delete Income
    const deleteIncome = async (id) => {
        try {
            await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
            // Refresh the income data after deleting
            await fetchIncomeDetails();
            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Income deleted successfully");
        } catch (error) {
            console.error("Error while deleting income:", error);
            toast.error(error.response?.data?.message || "Failed to delete income.");
        }
    };

    // Handle Download Excel
    const handleDownloadIncomeDetails = async () => {
        try {

            const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME, {
                responseType: 'blob'
            });
            
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "income_details.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Income details downloaded successfully");
        } catch (error) {
            console.error("Error while downloading income details:", error);
            toast.error("Failed to download income details");
        }
    };

    useEffect(() => {
        fetchIncomeDetails();
    }, []);

    // Add a small delay and refetch to ensure data is loaded properly
    const handleDataAdded = async () => {
        // Wait a bit for the API to process all the data
        setTimeout(() => {
            fetchIncomeDetails();
        }, 1000);
    };

    return (
        <DashboardLayout activeMenu="Income">
            <div className="my-5 mx-auto">
                {/* Sample Data Button */}
                <DummyDataButton onDataAdded={handleDataAdded} />

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <IncomeOverview
                            transactions={incomeData}
                            onAddIncome={() => setOpenAddIncomeModal(true)}
                        />
                    </div>

                    <IncomeList
                        transactions={incomeData}
                        onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
                        onDownload={handleDownloadIncomeDetails}
                        loading={loading}
                    />
                </div>

                <Modal
                    isOpen={openAddIncomeModal}
                    onClose={() => setOpenAddIncomeModal(false)}
                    title="Add Income"
                >
                    <AddIncomeForm onAddIncome={handleAddIncome} />
                </Modal>

                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                    title="Delete Income"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this income?"
                        onDelete={() => deleteIncome(openDeleteAlert.data)}
                        onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                    />
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default Income;