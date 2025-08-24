import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import { dummyGoals } from '../../utils/dummyData';
import GoalCard from '../../components/Goals/GoalCard';
import Modal from '../../components/Modal';
import AddGoalForm from '../../components/Goals/AddGoalForm';
import DeleteAlert from '../../components/DeleteAlert';
import { LuPlus, LuTarget } from 'react-icons/lu';
import toast from 'react-hot-toast';

const Goals = () => {
  useUserAuth();

  const [goals, setGoals] = useState(dummyGoals);

  const [openAddGoalModal, setOpenAddGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const handleAddGoal = (goalData) => {
    const newGoal = {
      _id: Date.now().toString(),
      ...goalData,
      targetAmount: Number(goalData.targetAmount),
      currentAmount: Number(goalData.currentAmount) || 0,
    };
    setGoals([...goals, newGoal]);
    setOpenAddGoalModal(false);
    toast.success('Goal added successfully!');
  };

  const handleUpdateGoal = (updatedGoal) => {
    setGoals(goals.map(goal => 
      goal._id === updatedGoal._id 
        ? { ...updatedGoal, targetAmount: Number(updatedGoal.targetAmount), currentAmount: Number(updatedGoal.currentAmount) }
        : goal
    ));
    setEditingGoal(null);
    setOpenAddGoalModal(false);
    toast.success('Goal updated successfully!');
  };

  const handleDeleteGoal = (goalId) => {
    setGoals(goals.filter(goal => goal._id !== goalId));
    setOpenDeleteAlert({ show: false, data: null });
    toast.success('Goal deleted successfully!');
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setOpenAddGoalModal(true);
  };

  return (
    <DashboardLayout activeMenu="Goals">
      <div className="my-5 mx-auto">
        {/* Header */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <LuTarget className="text-purple-600 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Financial Goals</h1>
                <p className="text-gray-600">Track and achieve your financial objectives</p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingGoal(null);
                setOpenAddGoalModal(true);
              }}
              className="add-btn add-btn-fill"
            >
              <LuPlus className="text-lg" />
              Add Goal
            </button>
          </div>
        </div>

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <div className="card text-center py-12">
            <LuTarget className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Goals Yet</h3>
            <p className="text-gray-500 mb-6">Start by creating your first financial goal</p>
            <button
              onClick={() => setOpenAddGoalModal(true)}
              className="add-btn add-btn-fill"
            >
              <LuPlus className="text-lg" />
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <GoalCard
                key={goal._id}
                goal={goal}
                onEdit={handleEditGoal}
                onDelete={(goalId) => setOpenDeleteAlert({ show: true, data: goalId })}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        <Modal
          isOpen={openAddGoalModal}
          onClose={() => {
            setOpenAddGoalModal(false);
            setEditingGoal(null);
          }}
          title={editingGoal ? 'Edit Goal' : 'Add New Goal'}
        >
          <AddGoalForm
            onAddGoal={handleAddGoal}
            editingGoal={editingGoal}
            onUpdateGoal={handleUpdateGoal}
          />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Goal"
        >
          <DeleteAlert
            content="Are you sure you want to delete this goal? This action cannot be undone."
            onDelete={() => handleDeleteGoal(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Goals;