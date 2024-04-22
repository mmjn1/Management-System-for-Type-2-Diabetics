
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const initialState = {
  Medicine: [],
  status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
}

export const fetchMedicine = createAsyncThunk(
  'Medicine/fetchMedicine',
  async () => {
    const response = await axios.get('api/Medicine/')
    return response.data
  },
)

export const createMedicine = createAsyncThunk(
  'Medicine/createMedicine',
  async studentData => {
    const response = await axios.post('api/Medicine/', studentData)
    return response.data
  },
)

export const updateMedicine = createAsyncThunk(
  'Medicine/updateMedicine',
  async data => {
    const response = await axios.patch(`api/Medicine/${data.id}/`, data)
    return response.data
  },
)

export const deleteMedicine = createAsyncThunk(
  'Medicine/deleteMedicine',
  async id => {
    await axios.delete(`api/Medicine/${id}/`)
    return id 
  },
)

export const MedicineSlice = createSlice({
  name: 'Medicine',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    let TID = null

    builder
      .addCase(fetchMedicine.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchMedicine.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.Medicine = action.payload
      })
      .addCase(fetchMedicine.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(createMedicine.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(createMedicine.fulfilled, (state, action) => {
        toast.success('Medicine successfully created', { id: TID })
        state.status = 'succeeded'
        state.Medicine = action.payload
      })
      .addCase(createMedicine.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('Medicine already exists', { id: TID })
        state.error = action.error.message
      })

      .addCase(updateMedicine.pending, state => {
        state.status = 'loading'
        TID = toast.loading('Updating...')
      })
      .addCase(updateMedicine.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const MedicineIndex = state.Medicine.findIndex(
          item => item.id === action.payload.id,
        )
        if (MedicineIndex !== -1) {
          // Update the is_blocked property
          state.Medicine[MedicineIndex].is_blocked = action.payload.is_blocked

          toast.success('Updated...', { id: TID })
        } else {
          // Handle if the Medicine is not found (might be an error condition)
        }
        // state.Medicine = [...state.Medicine, action.payload]
        toast.success('Updated...', { id: TID })
      })
      .addCase(updateMedicine.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        toast.error('An unexpected error occurred', { id: TID })
      })

      .addCase(deleteMedicine.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.status = 'succeeded'
        toast.success('Medicine successfully removed', { id: TID })
        state.Medicine = state.Medicine.filter(
          teacher => teacher.id !== action.payload,
        )
      })
      .addCase(deleteMedicine.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('An error occurred', { id: TID })
        state.error = action.error.message
      })
  },
})

export default MedicineSlice.reducer
