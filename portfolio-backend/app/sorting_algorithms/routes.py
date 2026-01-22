from flask import Blueprint, request, jsonify
from app import db
from app.sorting_algorithms.models import SortingAlgorithmOperation
from app.sorting_algorithms.utils import bubble_sort_steps, selection_sort_steps, insertion_sort_steps, quick_sort_steps, merge_sort_steps

sorting_bp = Blueprint('sorting', __name__, url_prefix='/sorting-algorithms')


@sorting_bp.route('/bubble-sort', methods=['POST'])
def bubble_sort():
    """Execute bubble sort and return steps."""
    try:
        data = request.get_json()
        if not data or 'array' not in data:
            return jsonify({'error': 'Missing array in request'}), 400
        
        input_array = data['array']
        if not isinstance(input_array, list):
            return jsonify({'error': 'Array must be a list'}), 400
        
        output_array, frames = bubble_sort_steps(input_array)
        
        # Save to database
        operation = SortingAlgorithmOperation(
            algorithm_name='bubble_sort',
            input_array=input_array,
            output_array=output_array,
            steps=frames,
            complexity_time='O(n²)',
            complexity_space='O(1)'
        )
        db.session.add(operation)
        db.session.commit()
        
        return jsonify({
            'id': operation.id,
            'algorithm': 'bubble_sort',
            'input': input_array,
            'output': output_array,
            'steps': frames,
            'complexity': {'time': 'O(n²)', 'space': 'O(1)'}
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@sorting_bp.route('/selection-sort', methods=['POST'])
def selection_sort():
    """Execute selection sort and return steps."""
    try:
        data = request.get_json()
        if not data or 'array' not in data:
            return jsonify({'error': 'Missing array in request'}), 400
        
        input_array = data['array']
        if not isinstance(input_array, list):
            return jsonify({'error': 'Array must be a list'}), 400
        
        output_array, frames = selection_sort_steps(input_array)
        
        # Save to database
        operation = SortingAlgorithmOperation(
            algorithm_name='selection_sort',
            input_array=input_array,
            output_array=output_array,
            steps=frames,
            complexity_time='O(n²)',
            complexity_space='O(1)'
        )
        db.session.add(operation)
        db.session.commit()
        
        return jsonify({
            'id': operation.id,
            'algorithm': 'selection_sort',
            'input': input_array,
            'output': output_array,
            'steps': frames,
            'complexity': {'time': 'O(n²)', 'space': 'O(1)'}
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@sorting_bp.route('/insertion-sort', methods=['POST'])
def insertion_sort():
    """Execute insertion sort and return steps."""
    try:
        data = request.get_json()
        if not data or 'array' not in data:
            return jsonify({'error': 'Missing array in request'}), 400
        
        input_array = data['array']
        if not isinstance(input_array, list):
            return jsonify({'error': 'Array must be a list'}), 400
        
        output_array, frames = insertion_sort_steps(input_array)
        
        # Save to database
        operation = SortingAlgorithmOperation(
            algorithm_name='insertion_sort',
            input_array=input_array,
            output_array=output_array,
            steps=frames,
            complexity_time='O(n²)',
            complexity_space='O(1)'
        )
        db.session.add(operation)
        db.session.commit()
        
        return jsonify({
            'id': operation.id,
            'algorithm': 'insertion_sort',
            'input': input_array,
            'output': output_array,
            'steps': frames,
            'complexity': {'time': 'O(n²)', 'space': 'O(1)'}
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@sorting_bp.route('/quick-sort', methods=['POST'])
def quick_sort():
    """Execute quick sort and return steps."""
    try:
        data = request.get_json()
        if not data or 'array' not in data:
            return jsonify({'error': 'Missing array in request'}), 400
        
        input_array = data['array']
        if not isinstance(input_array, list):
            return jsonify({'error': 'Array must be a list'}), 400
        
        output_array, frames = quick_sort_steps(input_array)
        
        # Save to database
        operation = SortingAlgorithmOperation(
            algorithm_name='quick_sort',
            input_array=input_array,
            output_array=output_array,
            steps=frames,
            complexity_time='O(n log n)',
            complexity_space='O(log n)'
        )
        db.session.add(operation)
        db.session.commit()
        
        return jsonify({
            'id': operation.id,
            'algorithm': 'quick_sort',
            'input': input_array,
            'output': output_array,
            'steps': frames,
            'complexity': {'time': 'O(n log n)', 'space': 'O(log n)'}
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@sorting_bp.route('/merge-sort', methods=['POST'])
def merge_sort():
    """Execute merge sort and return steps."""
    try:
        data = request.get_json()
        if not data or 'array' not in data:
            return jsonify({'error': 'Missing array in request'}), 400
        
        input_array = data['array']
        if not isinstance(input_array, list):
            return jsonify({'error': 'Array must be a list'}), 400
        
        output_array, frames = merge_sort_steps(input_array)
        
        # Save to database
        operation = SortingAlgorithmOperation(
            algorithm_name='merge_sort',
            input_array=input_array,
            output_array=output_array,
            steps=frames,
            complexity_time='O(n log n)',
            complexity_space='O(n)'
        )
        db.session.add(operation)
        db.session.commit()
        
        return jsonify({
            'id': operation.id,
            'algorithm': 'merge_sort',
            'input': input_array,
            'output': output_array,
            'steps': frames,
            'complexity': {'time': 'O(n log n)', 'space': 'O(n)'}
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@sorting_bp.route('/history', methods=['GET'])
def get_history():
    """Get all sorting algorithm operations."""
    try:
        operations = SortingAlgorithmOperation.query.all()
        return jsonify([op.to_dict() for op in operations]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@sorting_bp.route('/<int:op_id>', methods=['GET'])
def get_operation(op_id):
    """Get a specific sorting operation by ID."""
    try:
        operation = SortingAlgorithmOperation.query.get(op_id)
        if not operation:
            return jsonify({'error': 'Operation not found'}), 404
        return jsonify(operation.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
