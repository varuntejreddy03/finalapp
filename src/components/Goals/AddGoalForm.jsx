import React, { useState } from 'react';
import Input from '../Inputs/Input';

const AddGoalForm = ({ onAddGoal, editingGoal, onUpdateGoal }) => {
  const [goal, setGoal] = useState({
    title: editingGoal?.title || '',
    description: editingGoal?.description || '',
    targetAmount: editingGoal?.targetAmount || '',
    currentAmount: editingGoal?.currentAmount || '',
    targetDate: editingGoal?.targetDate ? new Date(editingGoal.targetDate).toISOString().split('T')[0] : '',
  });

  const handleChange = (key, value) => setGoal({ ...goal, [key]: value });

  const handleSubmit = () => {
    if (editingGoal) {
      onUpdateGoal({ ...editingGoal, ...goal });
    } else {
      onAddGoal(goal);
    }
  };

  return (
    <div>
      <Input
        value={goal.title}
        onChange={({ target }) => handleChange('title', target.value)}
        label="Goal Title"
        placeholder="Emergency Fund, Vacation, etc."
        type="text"
      />

      <Input
        value={goal.description}
        onChange={({ target }) => handleChange('description', target.value)}
        label="Description"
        placeholder="Brief description of your goal"
        type="text"
      />

      <Input
        value={goal.targetAmount}
        onChange={({ target }) => handleChange('targetAmount', target.value)}
        label="Target Amount"
        placeholder="₹50000"
        type="number"
      />

      <Input
        value={goal.currentAmount}
        onChange={({ target }) => handleChange('currentAmount', target.value)}
        label="Current Amount"
        placeholder="₹10000"
        type="number"
      />

      <Input
        value={goal.targetDate}
        onChange={({ target }) => handleChange('targetDate', target.value)}
        label="Target Date"
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={handleSubmit}
        >
          {editingGoal ? 'Update Goal' : 'Add Goal'}
        </button>
      </div>
    </div>
  );
};

export default AddGoalForm;