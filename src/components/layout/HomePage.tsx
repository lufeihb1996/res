import type { RouteKey } from "../../app/routes";
import type { RestaurantProfile } from "../../domain/restaurant";

interface HomePageProps {
  profile: RestaurantProfile;
  onNavigate: (route: RouteKey) => void;
}

export function HomePage({ profile, onNavigate }: HomePageProps) {
  return (
    <section className="page home-page">
      <div className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{profile.cuisine}</p>
          <h1>{profile.name}</h1>
          <p className="hero-text">{profile.tagline}</p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => onNavigate("menu")}>
              查看菜单
            </button>
            <button className="secondary-button" type="button" onClick={() => onNavigate("reservations")}>
              预订座位
            </button>
            <button className="secondary-button" type="button" onClick={() => onNavigate("orders")}>
              开始点单
            </button>
          </div>
        </div>
        <div className="hero-visual" aria-label="餐厅菜品展示">
          <img
            alt="餐厅餐桌与菜品"
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85"
          />
          <div className="hero-panel" aria-label="餐厅信息">
            <dl>
              <div>
                <dt>电话</dt>
                <dd>{profile.phone}</dd>
              </div>
              <div>
                <dt>地址</dt>
                <dd>{profile.address}</dd>
              </div>
              <div>
                <dt>营业时间</dt>
                <dd>{profile.hours.join("；")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <section className="workflow-strip" aria-label="核心流程">
        <button type="button" onClick={() => onNavigate("menu")}>
          <strong>菜单浏览</strong>
          <span>分类、标签、可售状态一眼看清</span>
        </button>
        <button type="button" onClick={() => onNavigate("reservations")}>
          <strong>预订请求</strong>
          <span>提交后由餐厅确认可用性</span>
        </button>
        <button type="button" onClick={() => onNavigate("orders")}>
          <strong>点单请求</strong>
          <span>购物车汇总后提交待确认订单</span>
        </button>
      </section>
    </section>
  );
}
