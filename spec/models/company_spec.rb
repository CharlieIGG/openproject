require 'rails_helper'

RSpec.describe Company, type: :model do
  let(:owner) { create(:user) }
  let(:company) { create(:company, owner:) }

  describe '#owning_users' do
    context 'when parent_shares is empty' do
      it 'returns the owner user' do
        expect(company.owning_users).to eq([owner])
      end
    end

    context 'when parent_shares is not empty' do
      let(:parent_company) { create(:company, owner:) }
      let!(:share) { create(:share, parent: parent_company, child: company, active: true) }

      it 'returns the owning users of top owning companies' do
        expect(company.owning_users).to eq([owner])
      end
    end
  end

  describe '#top_owning_companies' do
    let(:parent_company) { create(:company, owner:) }
    let(:grandparent_company) { create(:company, owner:) }
    let!(:share1) { create(:share, parent: grandparent_company, child: parent_company, active: true) }
    let!(:share2) { create(:share, parent: parent_company, child: company, active: true) }

    it 'returns the top owning companies' do
      expect(company.top_owning_companies).to eq([grandparent_company])
    end
  end
end
